var fs = require('fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var compress = require('../lib/commands/compress');

describe('Compress', function () {
  it('works with valid basic example', function () {
    var output = fs.readFileSync(__dirname + '/docs/example.md', 'utf8');
    var baseDir = __dirname + '/files/example';

    var files = [
      {
        'path': baseDir + '/hello-world.js'
      },
      {
        'path': baseDir + '/hello-world.txt'
      }
    ];

    files = files.map(function (file) {
      file.content = fs.readFileSync(file.path, 'utf8');
      return file;
    })

    return compress({
      'root': baseDir,
      'files': files
    })
      .then(function (res) {
        res.should.equal(output);
      });
  });

  it('fails with no inputs', function () {
    return compress().should.eventually.be.rejected;
  });
});