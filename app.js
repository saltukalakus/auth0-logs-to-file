require('dotenv-safe').load();
const path = require('path');
const request = require("request");
const cache = require('memory-cache');
const winston   = require('winston');
const fs        = require('fs');

// TODO: These could also be .env variables
const logDir    = 'logs';
const logFile   = `results.log`;
const TenHours = 10*60*60; //In sec

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: `${logDir}/${logFile}`,
      timestamp: false,
      prettyPrint: true,
      level: 'info'
    })
  ]
});

var options = { method: 'POST',
  url: 'https://' + process.env.AUTH0_DOMAIN + '/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: 
  { grant_type: 'client_credentials',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/' },
  json: true };

function getManagementToken(cb) {
  var cached = cache.get(process.env.AUTH0_CLIENT_ID);
  if (cached) {
    console.log("Returning cached token");
    cb(null, cached);
  } else {
    console.log("Getting a new token");
    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
        throw new Error(error);
      }
      var cacheTimeout = parseInt(body.expires_in) > TenHours ? TenHours : parseInt(body.expires_in);
      cache.put(process.env.AUTH0_CLIENT_ID, body, cacheTimeout*1000);
      cb(null, body);
    });
  }
}

function getLogs(domain, token, take, from, cb) {
  var url = `https://` + process.env.AUTH0_DOMAIN + `/api/v2/logs`;

  request({
    method: 'GET',
    url: url,
    json: true,
    qs: {
      take: take,
      from: from,
      sort: 'date:1',
      per_page: take
    },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  }, (err, res, body) => {
    if (err) {
      console.log('Error getting logs', err);
      cb(null, err);
    } else {
      cb(body);
    }
  });
}

function pushLogs (accessToken) {
  // Get the last log received from cache
  var checkpointId = cache.get("AUTH0CheckpointID");

  // If cache doesn't have the last log id, check to see if log file
  // exists and get the last log's _id from the log file.
  if (!checkpointId) {
    if (fs.existsSync(logDir + '/' + logFile)) {
        var buf = fs.readFileSync(logDir + '/' + logFile, "utf8");
        var re = /(\"_id\":\"(.*?)\")/g;
        var re2 = /[0-9]+/g;
        var matches = buf.match(re);
        checkpointId = matches[matches.length-1].match(re2)[0];
    }
  }

  // If last log's _id is not available in the cache and log file is not created yet
  // use the env variable for log _id otherwise first log id is null which forces the 
  // logging from the begging of the logs currently available in Auth0
  var startFromId = process.env.START_FROM_ID ? process.env.START_FROM_ID : null;
  var startCheckpointId = checkpointId === null ? startFromId : checkpointId;
  console.log("Log position : " + startCheckpointId);

  var take = process.env.BATCH_SIZE;
  take = take ? take : 100;

  getLogs(process.env.AUTH0_DOMAIN, accessToken, take, startCheckpointId, (logs, err) => {
    if (err) {
      console.log('Error getting logs from Auth0', err);
    }

    if (logs && logs.length) {
      console.log("Number of logs to store : " + logs.length);

      // Put the newest log entry we will log to file
      cache.put("AUTH0CheckpointID", logs[logs.length - 1]._id);
      
      // write to file
      for (log in logs) {
        logger.info(logs[log]);
      }
      
      console.log('Write complete.');
    }
  });
}

setInterval(function() { 
  getManagementToken(function(err, resp) {
  if (err) {
      return console.log(err); 
  }
  console.log("Run in loop");
  pushLogs(resp.access_token);
})}, process.env.POLLING_INTERVAL_IN_SEC * 1000); // in milisec
