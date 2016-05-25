# promisify-git

This library aims to operate git repo locally in promisifying way.

if you get any bugs or improvements, please check this repo and make it better. Making a pull request is preferred.

## install

```javascript
npm install promisify-git -S
```


## usage

```javascript
var git = require('promisify-git');

git
  .getBranch()
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


## API

### tag

* hasTag(tagName,[options])
* addTag(tagName,[options])
* updateTag(new_tagName,[options])
* delTag(tagName,[options])
* getTags([options])

### branch

* hasBranch(branchName,[options])
* addBranch(branchName,[options])
* delBranch(branchName,[options])
* updateBranch(oldBranch,newBranch,[options])
* getBranch([options])
* getBranches([options])


continuing...

# Good Library Companions
* [promisify-cli](https://www.npmjs.com/package/promisify-cli)
* [promisify-bash](https://www.npmjs.com/package/promisify-bash)
* [promisify-fs](https://www.npmjs.com/package/promisify-fs)
* [promsifiy-fetch](https://www.npmjs.com/package/promisify-fetch)
* [promsifiy-npm](https://www.npmjs.com/package/promisify-npm)
