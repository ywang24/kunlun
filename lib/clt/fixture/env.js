var Config = require('config');
var AppiumDriver = require('kunlun').AppiumDriver;
var SauceLabs = require('saucelabs');

var sauce_username = process.env.SAUCE_USERNAME || '#<sauceLabsUsername>';
var sauce_password = process.env.SAUCE_ACCESS_KEY || '#<sauceLabsKey>';
var testobj_username = process.env.TESTOBJ_USERNAME || '#<testObjectKey>';
var testobj_password = process.env.TESTOBJ_ACCESS_KEY || '';

var sauceAccount = new SauceLabs({
  username: sauce_username,
  password: sauce_password,
  proxy: Config.proxy
});

var appiumDriver;

if (process.env.SAUCE === 'true') {
  // update SauceLabs settings
  Config.testServer = 'http://' + sauce_username + ':' + sauce_password + '@ondemand.saucelabs.com:80/wd/hub';
  Config.capabilities.app = 'sauce-storage:' + Config.remoteAppName;
  appiumDriver = new AppiumDriver(Config.testServer);

  // Root beforeEach and afterEach to handle SauceLabs dashboard status
  beforeEach(function() {
    var title = this.currentTest.fullTitle();

    if (Config.desiredCapabilities) {
      // Based on --browsers value, Magellan sends back desiredCapabilities to each test
      // in NODE_CONFIG env variable, which can be extracted in Config.desiredCapabilities
      // Currently Magellan only returns desiredCapabilities like follows:
      // {
      //  "browserName":"iphone",
      //  "version":"9.2",
      //  "platform":"OS X 10.10",
      //  "deviceName":"iPhone Simulator"
      // }
      // Pending for https://github.com/TestArmada/guacamole/issues/15 to fully integrate
      Config.capabilities.platformVersion = Config.desiredCapabilities.version;
      Config.capabilities.deviceName = Config.desiredCapabilities.deviceName;
    }

    return appiumDriver.init(Config.capabilities).then(function() {
      // feed back selenium session ID to parent process (Magellan)
      if (process.send) {
        process.send({
          type: 'selenium-session-info',
          sessionId: appiumDriver.sessionID
        });
      }

      // update Sauce dashboard status - job name
      sauceAccount.updateJob(appiumDriver.sessionID, {
        name: title
      }, function(err) {
        if (err) console.log(err);
      });
    }, function(reason) {
      console.log("Error reason: " + JSON.stringify(reason));
      if (reason.data.sessionId === undefined) {
        throw reason;
      } else {
        // update Sauce dashboard status when failed to initiate appium - job name
        sauceAccount.updateJob(JSON.parse(reason.data).sessionId, {
          name: title
        }, function(err, res) {
          throw reason;
        });
      }
    })
  });

  afterEach(function() {
    // update Sauce dashboard status - job result
    var build = process.env.BUILD === undefined ?
      Config.remoteAppName + '-' + Moment().format() :
      Config.remoteAppName + '-' + process.env.BUILD;
    var passed  = this.currentTest.state === 'passed' ? 1 : 0;
    sauceAccount.updateJob(appiumDriver.sessionID, {
      build: build,
      passed: passed
    }, function(err) {
      if (err) console.log(err);
    });

    return appiumDriver.quit();
  });
} else if (Config.capabilities.testobject_api_key) {
  appiumDriver = new AppiumDriver(Config.testServer);
  var cap = Config.capabilities;
  var build = process.env.BUILD === undefined ?
    Config.remoteAppName + '-' + Moment().format() :
    Config.remoteAppName + '-' + process.env.BUILD;
  cap.testobject_suite_name = build;

  beforeEach(function() {
    cap.testobject_test_name = this.currentTest.fullTitle();
    return appiumDriver.init(cap);
  });

  afterEach(function() {
    var passed = this.currentTest.state === 'passed';
    if(appiumDriver.sessionID) {
      var options = {
        uri: 'https://app.testobject.com:443/api/rest/appium/v1/session/' + appiumDriver.sessionID + '/test',
        json: true,
        strictSSL: false,
        method: 'PUT',
        proxy: Config.proxy,
        body: { passed: passed },
        auth: {
          user: testobj_username,
          password: testobj_password
        }
      };
      Request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
        } else {
          console.log('Error while sending TestObject test status');
          console.log(error);
        }
      });
    }
    return appiumDriver.quit();
  });
} else {
  appiumDriver = new AppiumDriver(Config.testServer);

  beforeEach(function() {
    return appiumDriver.init(Config.capabilities);
  });

  afterEach(function() {
    return appiumDriver.quit();
  });
}

module.exports.appiumDriver = appiumDriver;

