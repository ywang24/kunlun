// Logging utilities

'use strict';

require('colors');
var Fs = require('fs');

exports.configure = function(driver) {
  if (process.env.DEBUG) {
    driver.on('status', function(info) {
      console.log(info.cyan);
    });
    driver.on('command', function(meth, path, data) {
      console.log(' > ' + meth.yellow, path.grey, data || '');
    });
    driver.on('http', function(meth, path, data) {
      console.log(' > ' + meth.magenta, path, (data || '').grey);
    });
  }

  if (process.env.DEBUG_FILE) {
    var writeStream = Fs.createWriteStream(
      process.env.DEBUG_FILE,
      { flags: 'a' }
    );
    driver.on('status', function (info) {
      writeStream.write(info.cyan, 'utf8');
    });
    driver.on('command', function (meth, path, data) {
      writeStream.write(data || '', 'utf8');
    });
    driver.on('http', function (meth, path, data) {
      writeStream.write(data || '', 'utf8');
    });
  }
};

