var Util = require('util');

module.exports = {
  locators: {
    // accessibility id locators
    acc_id: {
      sample_button: 'Sample'
    },
    // xpath locators
    xpath: {
      sample_text: "//UIATextField[@name = 'Sample']"
    }
  },

  sampleMethod: function(driver, loc, textData) {
    return driver
     // .clickEl(loc.acc_id.sample_button)
     // .typeEl(textData, loc.xpath.sample_text, 'xpath');
  }

};
