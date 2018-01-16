# Ebay bot backend
All endpoints for the Ebay bot
## 1. Deployment

### 1.1. Apex Installation
Apex is used to deploy the functions from the command line.
On macOS, Linux, or OpenBSD run the following:
```
> curl https://raw.githubusercontent.com/apex/apex/master/install.sh | sh
```
Note that you may need to run the sudo version below, or alternatively chown /usr/local:
```
> curl https://raw.githubusercontent.com/apex/apex/master/install.sh | sudo sh
```
On Windows download binary.

If already installed, upgrade with:
```
> apex upgrade
```
Go to http://apex.run to learn more about Apex
### 1.2. Project Scripts
All scripts should be run from the root folder

**Clean:** Cleans the project. Removes zip and node module packages as well as build artifacts. Always perform this before commiting to the repo.
```
> ./scripts/clean_all.sh
```
**Local build:** builds a function locally with npm install.
* -f: function name to test*
```
> ./scripts/local_build.sh -f bot
```
**Local testing:** *Run build first*. Runs an emulated Lambda environment to localy test the Lambda.
* -f: function name to test*
* -e: script with. This is the body to post*
* -v: <3/2/1/0>', (optional) Default 3. Level 2 dismiss handler() text, level 1 dismiss lambda-local text and level 0 dismiss also the result.*
```
> ./scripts/local_test.sh -f bot -e functions/bot/tests/listing.js -v 2
```
**Deploy to AWS:** deploys the Lambda function specified to AWS and sets a version number you can go back to with Apex in case of issues with future versions.
* -f: function name to test*
```
> ./scripts/deploy.sh -f bot
```
**Test remotely on AWS:** *Deploy the function to AWS first*. calls the function and runs the test unit scripts in functions/{function}/tests/.
* -f: function name to test*
```
> ./scripts/test.sh -f bot
```
**List functions info:** Lists all function info.
```
> ./scripts/list.sh
```
**Rollback:** *Deploy the function to AWS first*. Rolls back the function version to a previous one.
* -f: function name to rollback*
* -v (optional): version to rollback to. If no version then rollback to previous version*
```
> ./scripts/rollback.sh -f bot -v 4
```
**Metrics:** *Deploy the function to AWS first*. Display function metrics.
* -f(optional): function name to display. If no function then display all functions metrics*
```
> ./scripts/metrics.sh -f bot
```
