var fs = require('fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var addFunction = require('../lib/add')
var addCommand = require('../lib/commands/add');
var reader = require('../lib/reader');

describe('Add function', function () {
  it('adds a file correctly');
  it('replaces a file correctly');
});

describe('Add command', function () {
  var addPromise;
  var addResult;

  it('works with example document', function () {
    var document = fs.readFileSync(__dirname + '/docs/example.md', 'utf8');
    var file = fs.readFileSync(__dirname + '/files/example/hello-world.txt', 'utf8');

    addPromise = addCommand({
      'path': 'hello-world.txt',
      'content': file
    }, {
      'path': null,
      'content': document
    })
      .then(function (res) {
        res.status.should.equal('replaced');
        addResult = res.output;
      });
  });

  it('outputs a valid document', function () {
    var doc = reader(addResult);
    doc.files.length.should.equal(2);
    doc.files[1].name.should.equal('hello-world.txt');
  });
});
