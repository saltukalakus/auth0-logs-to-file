# Auth0 - Logs to File

This project is a simple Node.js application which will take all of your Auth0 logs and exports them to `./logs/auth0.logs` in the same folder where this application runs.

## Configure
* Install Node.js and Npm in your local environment if you haven't installed yet.

* Create a new client for your Logger as described [here](https://auth0.com/docs/api/management/v2/tokens#1-create-and-authorize-a-client).
Note that, inorder to receive logs from Auth0, you need to set `read:logs` scope for this client.

* Copy .env.example as .env in the same folder. Update the .env for your Auth0 Logger client created in the previous step.

    * AUTH0_CLIENT_ID : Your Auth0 client ID for Logger.
    * AUTH0_CLIENT_SECRET : Your Auth0 client secret for Logger.
    * AUTH0_DOMAIN : Your Auth0 account domain. YOUR_DOMAIN.auth0.com or YOUR_DOMAIN.(au|eu).auth0.com 
    * BATCH_SIZE : Batch size to request logs in single API call. Set to 100 which is the default value.
    * START_FROM_ID : Set the log _id to start logging from a specific point in time. If you want to start from the beginning set `null`. Once the log file is created, application resumes from the last log in the log file.
    * POLLING_INTERVAL_IN_SEC : Interval where log API is polled in seconds.
    * NEXT_READ_WAIT_IN_SEC : If this value is greater than zero, logs are stored in two passes. This variable also controls the wait period between first and second pass. First pass and second pass should have the same logs and order for them to be stored in the log file.
    * TRACK_THE_LATEST_IN_SEC : When the logger reaches to the edge of the Auth0 logs, it makes extra delay before the next pass for Auth0 logs to be stabilised. NEXT_READ_WAIT_IN_SEC should also be greater than 0 for this option to take affect. Set this something like 600 seconds.

## Usage
```bash
   npm install
   npm start
```

If you want to generate automated dummy test logs you could modify the `./testbed/log_generator.sh` with your account settings and call from command-line in Linux or Mac.

```bash
   $> cd ./testbed
   $> ./log_generator.sh
````

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 Account

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
