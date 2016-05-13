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
var git = function(subcmd, options) {
  if (!subcmd)
    subcmd = 'status'

  if (!options)
    options = {};

  return bash('git ' + subcmd, options);
}

//get all file in a directory recursively
var getFilesByDir = function(dir_path) {
  return fs.statAsync(dir_path)
    .call('isDirectory')
    .then(function(isDirectory) {
      if (isDirectory) {
        return fs.readdirAsync(dir_path)
          .map(function(file_name) {
            var file_path = dir_path + '/' + file_name;
            return fs.statAsync(file_path)
              .then(function(stat) {
                return {
                  isDirectory: stat.isDirectory(),
                  file_path: file_path
                }
              })
          })
          .reduce(function(files, file_item) {
            if (file_item.isDirectory) {
              return getFilesByDir(file_item.file_path)
                .then(function(subDirFiles) {
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
var getGitRepo = function(git_repo_path) {
  if (!git_repo_path)
    git_repo_path = process.cwd() + '/.git';

  return fs.statAsync(git_repo_path)
    .call('isDirectory')
    .then(function(exist) {
      return exist && git_repo_path
    })
}

//get current branch, default: .git/HEAD
git.getBranch = function(git_repo_path) {
  return getGitRepo(git_repo_path)
    .then(function(git_path) {
      var head_path = git_path + '/HEAD';

      return fs.readFileAsync(head_path,
        {
          encoding: 'UTF-8'
        })
        .then(function(head_cnt) {
          return head_cnt.trim().split('/').slice(2).join('/');
        })
    })
}

//get all local branches,default:.git/refs/heads/..
git.getBranches = function(git_repo_path) {
  return getGitRepo(git_repo_path)
    .then(function(git_path) {
      var heads_path = git_path + '/refs/heads';
      return getFilesByDir(heads_path)
        .map(function(head_file) {
          return head_file.replace(heads_path + '/', '')
        })
    })
}

//get all remote branches,default: .git/refs/remotes/..
git.getRemoteBranches = function(git_repo_path) {
  return getGitRepo(git_repo_path)
    .then(function(git_path) {
      var remote_heads_path = git_path + '/refs/remotes';
      return getFilesByDir(remote_heads_path)
        .map(function(head_file) {
          return head_file.replace(remote_heads_path + '/', '')
        })
    })
}

//get all local tags,default: .git/refs/tags/..
git.getTags = function(git_repo_path) {
  return getGitRepo(git_repo_path)
    .then(function(git_path) {
      var tags_path = git_path + '/refs/tags';
      return getFilesByDir(tags_path)
        .map(function(head_file) {
          return head_file.replace(tags_path + '/', '')
        })
    })
}

//Branch Command Operations
git.hasBranch = function(branchName) {
  return getBranches()
    .call('indexOf', branchName)
    .then(function(index) {
      return index !== -1
    })
}

git.addBranch = function(branchName) {
  return git('branch ' + branchName)
}

git.delBranch = function(branchName) {
  return git('branch -d ' + branchName)
}

git.updateBranch = function(oldName, newName) {
  return git('branch -m ' + oldName + ' ' + newName)
}

//Tag Command Operations
git.hasTag = function(tagname) {
  return getTags(cwd)
    .call('indexOf', tagname)
    .then(function(index) {
      return index !== -1
    })
}

git.addTag = function(tagname) {
  return git('tag ' + tagname,cwd)
}

git.updateTag = function(tagname) {
  return git('tag -f ' + tagname)
}

git.delTag = function(tagname) {
  return git('tag -d ' + tagname)
}

module.exports = git;
