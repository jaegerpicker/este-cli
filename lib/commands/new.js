/*
 * @fileOverview
 * @author: Mike Grabowski (@grabbou)
 */

'use strict';

var assert = require('assert');
var chalk = require('chalk');
var exec = require('child-process-promise').exec;
var fs = require('fs');
var Promise = require('bluebird');
var program = require('commander');
var path = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

function createNewProject(name, dest) {
  assert(name, 'You need to provide a name for new app');

  var options = {
    name: name,
    dest: path.resolve(dest || './' + name)
  };

  ensureEmptyFolder(options.dest)
    .then(makeFolder.bind(options))
    .tap(function goToFolder() {
      process.chdir(options.dest);
    })
    .then(cloneRepo.bind(options))
    .then(deleteGitFolder.bind(options))
    .then(initGit)
    .then(npmInstall)
    .then(npmDedupe)
    .then(function onSuccess() {
      console.log(chalk.green('Este.js app created in ', options.dest));
    })
    .catch(function onError(err) {
      console.log(chalk.bold.red(err.message));
    });
}

// Ensures folder is empty
function ensureEmptyFolder(folder) {
  return new Promise(function(resolve, reject) {
    fs.exists(folder, function(err, exists) {
      if (err || exists) return reject(new Error('Folder ' + folder + ' already exists. Please choose different one'));
      resolve();
    })
  });
}

// Makes folder for a new project
function makeFolder() {
  return new Promise(function(resolve, reject) {
    mkdirp(this.dest, function(err) {
      if (err) return reject(err);
      resolve();
    });
  }.bind(this));
}

// Gets repo link
function getRepo() {
  return 'https://github.com/steida/este';
}

// Clones repo
function cloneRepo() {
  console.log(chalk.blue('Cloning repository...'));
  return exec(
    'git clone --depth=1 ' + getRepo() + ' .'
  );
}

// Deletes current git folder
function deleteGitFolder() {
  var dest = this.dest;
  return new Promise(function(resolve, reject) {
    rimraf(dest + '/.git', function(err, data) {
      if (err) return reject(err);
      resolve(data);
    })
  });
}

// Creates new git
function initGit() {
  console.log(chalk.blue('Re-creating github repository...'));
  return exec('git init');
}

// Install packages
function npmInstall() {
  console.log(chalk.blue('Installing dependencies...'));
  return exec('npm install');
}

// Dedupe React package
function npmDedupe() {
  return exec('npm dedupe react');
}

program
  .command('new [name] [dest]')
  .alias('n')
  .description('Creates new Este.js project')
  .action(createNewProject);