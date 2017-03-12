#!/bin/bash
AUTH0_DOMAIN="saltukalakus.auth0.com"
CLIENT_ID_1="yB2FbvhXyR4OWiSAAOk8lmRGfrsLNJm2"
DB_CONN_1="newOne"
USR_NAME_1="saltuk@auth0.com"
USR_PASS_1="111111"
DB_CONN_2="mlabcustomdb"
USR_NAME_CONN_2="saltuk@auth0.com"
USR_PASS_CONN_2="111111"

COUNTER=0
while [  $COUNTER -lt 100 ]; do
sleep 1

# Should login
curl --request POST \
  --url 'https://'$AUTH0_DOMAIN'/oauth/ro' \
  --header 'content-type: application/json' \
  --data '{"client_id":'\"$CLIENT_ID_1\"', "username":'\"$USR_NAME_1\"', "password":'\"$USR_PASS_1\"', "connection":'\"$DB_CONN_1\"', "scope":"openid"}'

# Wrong password
curl --request POST \
  --url 'https://'$AUTH0_DOMAIN'/oauth/ro' \
  --header 'content-type: application/json' \
  --data '{"client_id":'\"$CLIENT_ID_1\"', "username":'\"$USR_NAME_1\"', "password":"some_dummy_pass", "connection":'\"$DB_CONN_1\"', "scope":"openid"}'

# Invalid DB connection
curl --request POST \
  --url 'https://'$AUTH0_DOMAIN'/oauth/ro' \
  --header 'content-type: application/json' \
  --data '{"client_id":'\"$CLIENT_ID_1\"', "username":'\"$USR_NAME_1\"', "password":'\"$USR_PASS_1\"', "connection":"FakeDbConnection", "scope":"openid"}'

# Invalid client
curl --request POST \
  --url 'https://'$AUTH0_DOMAIN'/oauth/ro' \
  --header 'content-type: application/json' \
  --data '{"client_id":"SomeInvalidClient", "username":'\"$USR_NAME_1\"', "password":'\"$USR_PASS_1\"', "connection":'\"$DB_CONN_1\"', "scope":"openid"}'

# Should login
curl --request POST \
  --url 'https://'$AUTH0_DOMAIN'/oauth/ro' \
  --header 'content-type: application/json' \
  --data '{"client_id":'\"$CLIENT_ID_2\"', "username":'\"$USR_NAME_2\"', "password":'\"$USR_PASS_2\"', "connection":'\"$DB_CONN_2\"', "scope":"openid"}'

# Invalid DB connection
curl --request POST \
  --url 'https://'$AUTH0_DOMAIN'/oauth/ro' \
  --header 'content-type: application/json' \
  --data '{"client_id":'\"$CLIENT_ID_2\"', "username":'\"$USR_NAME_2\"', "password":'\"$USR_PASS_2\"', "connection":"FakeDbConnection2", "scope":"openid"}'

# Invalid client
curl --request POST \
  --url 'https://'$AUTH0_DOMAIN'/oauth/ro' \
  --header 'content-type: application/json' \
  --data '{"client_id":"SomeInvalidClient2", "username":'\"$USR_NAME_2\"', "password":'\"$USR_PASS_2\"', "connection":'\"$DB_CONN_2\"', "scope":"openid"}'

done

