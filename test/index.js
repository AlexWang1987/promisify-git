var git = require('../index.js');

//current working directory
var cwd = __dirname.substring(0,__dirname.lastIndexOf('/'));

//getAllBranches
git
  .getBranches({
    cwd: cwd
  })
  .then(function(d) {
    console.log(d);
  })
  .catch(function(e) {
    console.log(e);
  })
