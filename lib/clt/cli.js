// Command Line Tool
// for setup basic page object Appium test framework scaffold as follows:

/*
├── README.md
├── app
├── config
│   ├── testData.json
│   └── default.json
├── lib
│   ├── index.js
│   ├── env.js
│   ├── magellan_setup.js
│   └── module
│       └── sampleModule.js
├── magellan.json
├── package.json
└── test
    ├── <projectName>
    │   └── sampleTest.js
    └── mocha.opt
*/

var Fs = require('fs');
var Path = require('path');
var Inquirer = require('inquirer');
var Exec = require('child_process').exec;
var argv = require('yargs')
  .usage('Usage: $0 init')
  .demand(1)
  .argv;

var questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'What\'s the name of your project (one word, no digits or special characters)',
    validate: function( value ) {
      var pass = value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/i);
      if (pass) {
        return true;
      } else {
        return 'Please enter a valid project name';
      }
    }
  },
  {
    type: 'checkbox',
    name: 'cloudSetting',
    message: 'Do you have your test cloud credentials? (You can choose to setup this later)',
    choices: ['None', 'Sauce Labs', 'TestObject']
  },
  {
    type: 'input',
    name: 'sauceLabsUsername',
    message: 'What\'s your Sauce Labs user name?',
    when: function(answers){
      return answers.cloudSetting.indexOf('Sauce Labs') !== -1;
    },
    validate: function( value ) {
      var pass = value.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/i);
      if (pass) {
        return true;
      } else {
        return 'Please enter a valid user name';
      }
    }
  },
  {
    type: 'input',
    name: 'sauceLabsKey',
    message: 'What\'s your Sauce Labs access key (in the format of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)?',
    when: function(answers){
      return answers.cloudSetting.indexOf('Sauce Labs') !== -1;
    },
    validate: function( value ) {
      var pass = value.match(/^[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}$/i);
      if (pass) {
        return true;
      } else {
        return 'Please enter a valid access key (in the format of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)';
      }
    }
  },
  {
    type: 'confirm',
    name: 'toContinue',
    message: 'This will create a basic test structure in the current directory and install nessasary npm packages locally. Are you sure to continue',
    default: true
  }
];

if(argv._[0] === 'init') {
  console.log('\n===========================================');
  console.log('Appium Test Framework Configuration Helper');
  console.log('===========================================\n');

  Inquirer.prompt( questions, function( answers ) {
    // console.log( JSON.stringify(answers, null, '  ') );

    if (!answers.toContinue) {
      process.exit(0);
    }
    var projectName = answers.projectName.toLowerCase();
    var sauceLabsUsername = answers.sauceLabsUsername || 'xxxxxxxxxx';
    var sauceLabsKey = answers.sauceLabsKey || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

    // set up app dir
    var dir = Path.join(process.cwd(), 'app');
    if (!Fs.existsSync(dir)){
      Fs.mkdirSync(dir);
    }

    // set up config dir
    dir = Path.join(process.cwd(), 'config');
    if (!Fs.existsSync(dir)){
      Fs.mkdirSync(dir);
    }
    // - write config/default.json
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/default.json', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    Fs.appendFileSync(Path.join(dir, 'default.json'), content);
    // - write config/testData.json
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/testData.json', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    Fs.appendFileSync(Path.join(dir, 'testData.json'), content);

    // set up lib dir
    dir = Path.join(process.cwd(), 'lib');
    if (!Fs.existsSync(dir)){
      Fs.mkdirSync(dir);
    }
    // - write lib/index.js
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/index.js', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    Fs.appendFileSync(Path.join(dir, 'index.js'), content);
    // - write lib/env.js
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/env.js', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    content = content.replace(/#<sauceLabsUsername>/g, sauceLabsUsername);
    content = content.replace(/#<sauceLabsKey>/g, sauceLabsKey);
    Fs.appendFileSync(Path.join(dir, 'env.js'), content);
    // - write lib/magellan_setup.js
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/magellan_setup.js', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    content = content.replace(/#<sauceLabsUsername>/g, sauceLabsUsername);
    content = content.replace(/#<sauceLabsKey>/g, sauceLabsKey);
    Fs.appendFileSync(Path.join(dir, 'magellan_setup.js'), content);
    // - create and write lib/module/sampleModule.js
    Fs.mkdirSync(Path.join(dir, 'module'));
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/sampleModule.js', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    Fs.appendFileSync(Path.join(dir, 'module', 'sampleModule.js'), content);

    // set up test dir
    dir = Path.join(process.cwd(), 'test');
    if (!Fs.existsSync(dir)){
      Fs.mkdirSync(dir);
    }
    // - write test/mocha.opts
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/mocha.opts', 'utf8');
    Fs.appendFileSync(Path.join(dir, 'mocha.opts'), content);
    // - create and write test/<projectName>/test.js
    Fs.mkdirSync(Path.join(dir, projectName));
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/sampleTest.js', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    Fs.appendFileSync(Path.join(dir, projectName, 'sampleTest.js'), content);

    // set up root dir
    dir = Path.join(process.cwd(), 'package.json');
    // - write package.json
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/package.json', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    Fs.appendFileSync(dir, content);
    // - write magellan.json
    dir = Path.join(process.cwd(), 'magellan.json');
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/magellan.json', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    Fs.appendFileSync(dir, content);
    // - write README.md
    dir = Path.join(process.cwd(), 'README.md');
    content = Fs.readFileSync( __dirname + Path.sep + 'fixture/README.md', 'utf8');
    content = content.replace(/#<projectName>/g, projectName);
    content = content.replace(/#<sauceLabsUsername>/g, sauceLabsUsername);
    content = content.replace(/#<sauceLabsKey>/g, sauceLabsKey);
    Fs.appendFileSync(dir, content);

    // start npm install
    console.log('\nInstalling npm packages (this might take a while)...');
    Exec('npm install kunlun appium q saucelabs config mocha testarmada-magellan testarmada-magellan-mocha-plugin --save', function (error, stdout, stderr) {
      if (error !== null) {
        console.log('npm install failed: ' + error);
        console.log('Please try kunlun init again');
      } else {
        console.log('\n================================================================');
        console.log('Basic Appium test framework was created successfully!');
        console.log('\nYou can start to add your modules as in lib/module/');
        console.log('Then use them in your tests as in test/' + projectName);
        console.log('\nTo try your sample test, put your app into app/');
        console.log('Update config/default.json accordingly');
        console.log('Start Appium server: \n\t./node_modules/.bin/appium');
        console.log('Then execute: \n\t./node_modules/.bin/mocha test/' + projectName);
        console.log('\n\nFor more information please refer to README.md');
        console.log('================================================================\n');
      }
    });
  });
}
