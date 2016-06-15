# Your Project Name

## Setup

* Install `Xcode 7.2` (If your Mac OS version is lower than 10.10.5, you need to upgrade your Mac OS first)
* Install [Node.js >= v0.12 and npm](http://nodejs.org/)
* Clone this repo and install npm package dependencies:
```
git clone <git repo link>
cd <project name>
npm install
```

Note: For the first time before running tests:

* You may want to verify your Appium setup first by running `appium-doctor`:

```bash
npm install appium-doctor
./node_modules//.bin/appium-doctor.js
```

* If you see popup "Instruments wants permission to analyze other processes." You need to allow access.
  You need to do this every time you install a new version of Xcode.

## Run tests locally

#### start Appium server:

```bash
node ./node_modules/appium/bin/appium.js
```

#### execute tests with Mocha directly (in another terminal window):

```bash
# Run tests by groups (e.g. run tests with @smoke tag in the title):
./node_modules/.bin/mocha ./test/#<projectName>/ -g @smoke

# Run test by test case name with debug logging:
DEBUG=true ./node_modules/.bin/mocha test/#<projectName>/ -g 'C0001'

# Run all the tests with debug logging saved into file:
DEBUG=./appium.log ./node_modules/.bin/mocha test/#<projectName>
```

#### Or you can execute tests with [Magellan](https://github.com/TestArmada/magellan) (in another terminal window):

```bash
# Run all the tests in parallel:
./node_modules/.bin/magellan

# Run all the tests one by one:
./node_modules/.bin/magellan --serial
```

## Run tests on [Sauce Labs](https://saucelabs.com/)

```bash
# Set Sauce Labs Credentials
export SAUCE_USERNAME='#<sauceLabsUsername>'
export SAUCE_ACCESS_KEY='#<sauceLabsKey>'

# Run all the tests in parallel on Sauce Labs:
SAUCE=true ./node_modules/.bin/magellan

# Upload app to Sauce Labs storage then run all the tests in parallel:
UPLOADAPP=true SAUCE=true ./node_modules/.bin/magellan

# Upload app to Sauce Labs storage with specified local app path and
remote file name, then run all the tests in parallel:
UPLOADAPP=true SAUCE=true NODE_CONFIG='{"remoteAppName": "yourapp.zip" "capabilities": {"app": "./app/yourapp.app"}}'
./node_modules/.bin/magellan
```

#### Login to Sauce Labs dashboard to see your test run



## About the tests

#### file structure, e.g:

```bash
.
└── projectRoot
    ├── README.md
    ├── app
    ├── lib
    |   ├── index.js
    |   ├── module
    |   │   └── sampleModule.js
    │   ├── env.js
    ├── config
    │   |── default.json
    |   └── testData.json
    ├── package.json
    └──── test
        ├── mocha.opts
        └── #<projectName>
            └── sampleTest.js

```

* default.json (/config) is the setup for Local appium server, Testing app and Desired capabilities that will be sent to Appium server.
  Settings in this file could be set as runtime variables.
* Test suites are grouped by test flow similarity.
* For every test suite, we suggest to create a matching page object module file in lib/module/ for locators and common actions.
* When create new test suite, reset and bind the page object module(s) that are needed for that test suite. e.g.

```javascript
    before(function() {
      appiumDriver.resetModules();
      appiumDriver.bindModule(test.sampleModule);
    });
```
