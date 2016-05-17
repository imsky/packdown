require('shelljs/global');

var path = require('path');

var header = cat(path.join(__dirname, 'docs-header.md'));
var footer = cat(path.join(__dirname, 'docs-footer.md'));

exec("jsdoc2md --property-list-format table 'index.js'",
  {'silent': true},
  function (code, stdout, stderr) {
    if (code !== 0) {
      console.error(stderr);
    } else {
      var apiDocs = stdout;
      exec("node ./bin/packdown --help", {'silent': true},
        function (code, stdout, stderr) {
          if (code !== 0) {
            console.error(stderr);
          } else {
            var cliDocs = stdout;

            console.log(header);
            console.log('```');
            console.log(cliDocs);
            console.log('```\r\n');
            console.log(apiDocs);
            console.log(footer);
          }
        });
    }
});
