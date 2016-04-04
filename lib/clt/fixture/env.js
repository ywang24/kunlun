var Config = require('config');
var AppiumDriver = require('appium-plus').AppiumDriver;
var SauceLabs = require('saucelabs');

var sauce_username = process.env.SAUCE_USERNAME || '#<sauceLabsUsername>';
var sauce_password = process.env.SAUCE_ACCESS_KEY || '#<sauceLabsKey>';

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
    return appiumDriver.init(Config.capabilities).then(function() {
      // update Sauce dashboard status - job name
      sauceAccount.updateJob(appiumDriver.sessionID, {
        name: title
      }, function(err) {
        if (err) console.log(err);
      });
    }, function(reason) {
      console.log(reason);
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
    var passed  = this.currentTest.state === 'passed' ? 1 : 0;
    sauceAccount.updateJob(appiumDriver.sessionID, {
      passed: passed,
    }, function(err) {
      if (err) console.log(err);
    });

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

