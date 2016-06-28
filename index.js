/*eslint-disable*/
var Promise = require('bluebird');
var bash = require('promisify-bash');
var fs = Promise.promisifyAll(require('fs'));

//git wrapper
var git = {};

/**
 * This is a git base tool
 * @param  {string}     sub      - Input your sub-command of the git eg: branch,git...
 * @param  {object}     options  - Refer to child_process.exec method.
 * @return {Promise}             - Return a git promise
 */
var git = function (subcmd, options) {
  if (!subcmd)
    subcmd = 'status'

  if (!options)
    options = {};

  return bash('git ' + subcmd, options);
}

//initilized a git repo
git.initGit = function (options) {
  return Promise.each([
    git('init', options),
    git('add .', options),
    git('commit -m "Git Initial Commit"', options)
  ], function (taskItem) {
    return taskItem
  });
}

//get all file in a directory recursively
var getFilesByDir = function (dir_path) {
  return fs.statAsync(dir_path)
    .call('isDirectory')
    .then(function (isDirectory) {
      if (isDirectory) {
        return fs.readdirAsync(dir_path)
          .map(function (file_name) {
            var file_path = dir_path + '/' + file_name;
            return fs.statAsync(file_path)
              .then(function (stat) {
                return {
                  isDirectory: stat.isDirectory(),
                  file_path: file_path
                }
              })
          })
          .reduce(function (files, file_item) {
            if (file_item.isDirectory) {
              return getFilesByDir(file_item.file_path)
                .then(function (subDirFiles) {
                  return files.concat(subDirFiles)
                })
            }
            files.push(file_item.file_path);
            return files
          }, [])
      }
      throw new Error('Please input a valid directory!');
    })
}

//get git_repo pathname, default: process.cwd() + '/.git'
var getGitRepo = function (options) {
  var git_repo_path = ((options && options['gcwd']) || process.cwd()) + '/.git';

  return fs.statAsync(git_repo_path)
    .call('isDirectory')
    .then(function (exist) {
      return exist && git_repo_path
    })
}

//get current branch, default: .git/HEAD
git.getBranch = function (options) {
  return getGitRepo(options)
    .then(function (git_path) {
      var head_path = git_path + '/HEAD';

      return fs.readFileAsync(head_path, {
          encoding: 'UTF-8'
        })
        .then(function (head_cnt) {
          return head_cnt.trim().split('/').slice(2).join('/');
        })
    })
}

//get all local branches,default:.git/refs/heads/..
git.getBranches = function (options) {
  return getGitRepo(options)
    .then(function (git_path) {
      var heads_path = git_path + '/refs/heads';
      return getFilesByDir(heads_path)
        .map(function (head_file) {
          return head_file.replace(heads_path + '/', '')
        })
    })
}

//get all remote branches,default: .git/refs/remotes/..
git.getRemoteBranches = function (options) {
  return getGitRepo(options)
    .then(function (git_path) {
      var remote_heads_path = git_path + '/refs/remotes';
      return getFilesByDir(remote_heads_path)
        .map(function (head_file) {
          return head_file.replace(remote_heads_path + '/', '')
        })
    })
}

//get all local tags,default: .git/refs/tags/..
git.getTags = function (options) {
  return getGitRepo(options)
    .then(function (git_path) {
      var tags_path = git_path + '/refs/tags';
      return getFilesByDir(tags_path)
        .map(function (head_file) {
          return head_file.replace(tags_path + '/', '')
        })
    })
}

//Branch Command Operations
git.hasBranch = function (branchName, options) {
  return getBranches(options)
    .call('indexOf', branchName)
    .then(function (index) {
      return index !== -1
    })
}

git.addBranch = function (branchName, options) {
  return git('branch ' + branchName, options)
}

git.delBranch = function (branchName, options) {
  return git('branch -d ' + branchName, options)
}

git.updateBranch = function (oldName, newName, options) {
  return git('branch -m ' + oldName + ' ' + newName, options)
}

//Tag Command Operations
git.hasTag = function (tagName, options) {
  return getTags(options)
    .call('indexOf', tagName)
    .then(function (index) {
      return index !== -1
    })
}

git.addTag = function (tagName, options) {
  return git('tag ' + tagName, options)
}

git.updateTag = function (tagName, options) {
  return git('tag -f ' + tagName, options)
}

git.delTag = function (tagName, options) {
  return git('tag -d ' + tagName, options)
}

module.exports = git;

