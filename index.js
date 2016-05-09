var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var spawn = require('child_process').spawn;

//get git_repo pathname, default: process.cwd() + '/.git'
var getGitRepo = function(git_path) {
  if (!git_path)
    git_path = process.cwd() + '/.git';

  return fs.statAsync(git_path)
    .call('isDirectory')
    .then(function(exist) {
      return exist && git_path
    })
}

//get current branch, default: .git/HEAD
var getCurrentBranch = function() {
  return getGitRepo()
    .then(function(git_path) {
      var HEAD_path = git_path + '/HEAD';

      return fs.readFileAsync(HEAD_path,
        {
          encoding: 'UTF-8'
        })
        .then(function(head_cnt) {
          return head_cnt.trim().split('/').slice(2).join('/');
        })
    })
}

//get all local branches,default:.git/refs/heads/..
var getLocalBranches = function() {
  return getGitRepo()
    .then(function(git_path) {
      var localHeads = git_path + '/refs/heads';

      return fs.readdirAsync(localHeads)
        .then(function(heads) {
          return heads
        })
    })
}

getLocalBranches()
  .then(function(d) {
    console.log(d);
  })
  .catch(function(e) {
    console.log(e);
  })

