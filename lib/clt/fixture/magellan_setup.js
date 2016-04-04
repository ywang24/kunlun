var Q = require('q');
var Path = require('path');
var Exec = require('child_process').execSync;
var Config = require('config');

var sauce_username = process.env.SAUCE_USERNAME || '#<sauceLabsUsername>';
var sauce_password = process.env.SAUCE_ACCESS_KEY || '#<sauceLabsKey>';

var SetupTeardown = function () {
};

SetupTeardown.prototype = {
  initialize: function () {
    var deferred = Q.defer();

    if (process.env.SAUCE !== 'true' || process.env.UPLOADAPP !== 'true') {
      deferred.resolve();
      return deferred.promise;
    } else {
      // Zip Config.capabilities.app then upload to Sauce Labs storage
      var config_source = {};
      Config.util.getConfigSources().forEach(function (source) {
        if (source.parsed.capabilities) {
          if (source.parsed.capabilities.app) {
            config_source.appPath = source.parsed.capabilities.app;
            config_source.name = source.name;
          }
        }
      })
      var app_path;
      if (Path.isAbsolute(config_source.appPath)) {
        app_path = config_source.appPath;
      } else if (config_source.name === '$NODE_CONFIG') {
        app_path = config_source.appPath;
      } else {
        app_path = Path.relative('../..', config_source.appPath)
      }

      // do asynchronous setup stuff here. Resolve (or reject) promise when ready.
      // Compress app if it is an iOS app file, for ipa/apk app file, don't compress
      var localZipFilePath = app_path;
      if(Path.extname(app_path) === '.app'){
        console.log('\nStart app compression...');
        var localZipFilePath = Path.join(Path.dirname(app_path), Config.remoteAppName);
        Exec('zip -r ' + localZipFilePath + ' ' + app_path);
        console.log('Compression successful')
      }

      // Upload app to Sauce Labs storage
      console.log('Start uploading ' + localZipFilePath + ' to Sauce Labs storage...');
      Exec(
        'curl -u ' + sauce_username + ':' + sauce_password +
        ' -X POST "http://saucelabs.com/rest/v1/storage/' + sauce_username +
        '/' + Config.remoteAppName +
        '?overwrite=true" -H "Content-Type: application/octet-stream" --data-binary @'+
        localZipFilePath, {stdio:[0, null]}
      );
      console.log('Upload successful, you are good to go!');

      // Remove zipped file
      if(Path.extname(app_path) === '.app'){
        Exec('rm -fr ' + localZipFilePath);
      }

      deferred.resolve();
      return deferred.promise;
    }
  }

};

module.exports = SetupTeardown;
