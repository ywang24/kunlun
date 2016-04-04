'use strict';

var test = require('../../lib');
var appiumDriver = test.appiumDriver;
var testData = test.testData;

describe('Sample tests -', function() {

  before(function() {
    appiumDriver.resetModules();
    appiumDriver.bindModule(test.sampleModule);
  });

  it('This is a sample test [C0001] @smoke', function() {
    return appiumDriver
      .sampleMethod(testData.sampleText);
  });

});
