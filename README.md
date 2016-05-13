# promisify-git

This library aims to operate git repo locally in promisifying way.

if you get any bugs or improvements, please check this repo and make it better. Making a pull request is preferred.


# usage

```javascript
var git = require('promisify-git');

git
  .getCurrentBranch()
  .then(function(branch) {
    console.log(branch);
  })
  .catch(function(e) {
    console.log(e);
  })

git
  .getTags()
  .then(function(tags) {
    console.log(tags);
  })
  .catch(function(e) {
    console.log(e);
  })

//you can specify any git working directory with parameter **cwd**
git
  .getBranches({
    cwd: cwd //optional, a specific git working directory , default is process.cwd
  })
  .then(function(branches) {
    console.log(branches);
  })
  .catch(function(e) {
    console.log(e);
  })

```
