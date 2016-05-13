# promisify-git

This library aims to operate git repo locally in promisifying way.

if you get any bugs or improvements, please check this repo and make it better. Making a pull request is preferred.


# usage

```
var git = require('promisify-git');

//current working directory
var cwd = __dirname.substring(0,__dirname.lastIndexOf('/'));

//getTags
git
  .getTags()
  .then(function(tags) {
    console.log(tags);
  })
  .catch(function(e) {
    console.log(e);
  })

//getAllBranches with specific git working directory
git
  .getBranches({
    cwd: cwd //optional,git working directory , default is process.cwd
  })
  .then(function(branches) {
    console.log(branches);
  })
  .catch(function(e) {
    console.log(e);
  })

```
