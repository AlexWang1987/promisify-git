var git = require('../index.js');

//current working directory
var cwd = __dirname.substring(0, __dirname.lastIndexOf('/'));

//getAllBranches
git
  .initGit({
    gcwd: './'
  })
  .then(function (d) {
    console.log(d);
  })
  .catch(function (e) {
    console.error('catch->', e);
  })

