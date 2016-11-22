'use strict';

var Wd = require('wd');
var PromiseChainWebdriver = Wd.PromiseChainWebdriver;
var Util = require('util');
var Url = require('url');
var _ = require('lodash');
var Q = require('q');
var should = require('chai').should();

// Initialize AppiumDriver object
// - server: Selenium/Appium test server address
// - options: extra settings when create AppiumDriver
// - options.maxWaitTime: timeout value for waiting specific element to display
var AppiumDriver = function (server, options) {
  options = options || {};
  options.maxWaitTime = options.maxWaitTime || 60000;

  PromiseChainWebdriver.call(this, Url.parse(server));
  this.modMethods = {};
  this.maxWaitTime = options.maxWaitTime;
  require('./logging').configure(this);
};

// AppiumDriver inherits all WD promise chain methods
Util.inherits(AppiumDriver, PromiseChainWebdriver);

// Set max wait timeout period, in milliseconds
// default value is 60 seconds
AppiumDriver.prototype.setWaitTimeout = function(timeout) {
  this.maxWaitTime = timeout;
};

// Send special key as defined in https://github.com/admc/wd/blob/master/lib/special-keys.js
// e.g. this.typeSpecialKey('Return');
AppiumDriver.prototype.typeSpecialKey = function(specialKey) {
  return this.keys(Wd.SPECIAL_KEYS[specialKey]);
};

// Wait until specific element is displayed
// [by] for native context, it could be 'class name', 'xpath', 'accessibility id', '-ios uiautomation', '-android uiautomator'
//      for webview context, it could be 'class name', 'css selector', 'xpath'
//      default is 'accessibility id'
AppiumDriver.prototype.waitTillAvailable = function(selector, by) {
  by = by || 'accessibility id';
  var Asserter = Wd.Asserter;
  return this.waitForElement(by, selector, {
    timeout: this.maxWaitTime,
    asserter: Wd.asserters.isDisplayed
  });
};

// Wait until specific element is NOT displayed
AppiumDriver.prototype.waitTillNotAvailable = function(selector, by) {
  by = by || 'accessibility id';
  return this.waitForElement(by, selector, {
    timeout: this.maxWaitTime,
    asserter: Wd.asserters.isNotDisplayed
  });
};

// Click on selected element after waiting for it to display
AppiumDriver.prototype.clickEl = function(selector, by) {
  by = by || 'accessibility id';
  return this
   .waitTillAvailable(selector, by)
   .click();
};

// Type text in selected element after waiting for it to display
AppiumDriver.prototype.typeEl = function(value, selector, by) {
  by = by || 'accessibility id';
  return this
   .waitTillAvailable(selector, by)
   .sendKeys(value);
};

// Search for multiple elements after waiting for any of them to display
AppiumDriver.prototype.getEls = function(selector, by) {
  by = by || 'class name';
  return this
   .waitTillAvailable(selector, by)
   .elements(by, selector);
};

// Search for element after waiting for any of them to display
AppiumDriver.prototype.getEl = function(selector, by) {
  by = by || 'accessibility id';
  return this
   .waitTillAvailable(selector, by)
   .element(by, selector);
};

// Check if an element exists
AppiumDriver.prototype.hasEl = function(selector, by) {
  by = by || 'accessibility id';
  return this
   .hasElement(by, selector);
};

AppiumDriver.prototype.hasComponent = function(selector, by, assertion) {
  return this
   .hasEl(selector, by)
   .then(assertion);
},

// Get the value of an element's attribute after waiting for it to display
AppiumDriver.prototype.getElAttribute = function(attr, selector, by) {
  by = by || 'accessibility id';
  return this
   .waitTillAvailable(selector, by)
   .getAttribute(attr);
};

// Bind functions from customized page object modules to AppiumDriver object
AppiumDriver.prototype.bindModule = function(mod) {
  var self = this;

  _.functions(mod).forEach(function(name) {
    if (!self.modMethods[name]) {
      self.modMethods[name] = {};
      self.modMethods[name].command = mod[name];
      self.modMethods[name].locators = mod.locators;
    } else {
      // throw out duplicated method name exception
      throw new Error(Util.format('method %s (from %s) has already existed', name, mod.name));
    }

    var wrappedMethod = function() {
      var args = _.toArray(arguments);
      args.unshift(self, self.modMethods[name].locators);
      // args.unshift(self);

      var promise = new Q(self.modMethods[name].command.apply(self, args));
      self._enrich(promise);
      return promise;
    };

    // bind new promise to appium driver
    AppiumDriver.prototype[name] = wrappedMethod;
  });
};

// Clean up customized page object modules functions
AppiumDriver.prototype.resetModules = function() {
  this.modMethods = {};
};

// Click on built-in Back button
AppiumDriver.prototype.goBack = function() {
  return this
   .clickEl('Back');
};

// Click on built-in Cancel button
AppiumDriver.prototype.cancelLastMove = function() {
  return this
   .clickEl('Cancel');
};

AppiumDriver.prototype.scrollDown = function() {
  return this
    .execute("mobile: scroll", [{ direction: 'down' }])
};

AppiumDriver.prototype.scrollUp = function() {
  return this
    .execute("mobile: scroll", [{ direction: 'up' }])
};


module.exports = AppiumDriver;

