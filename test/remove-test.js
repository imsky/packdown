var fs = require('fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var removeFunction = require('../lib/remove')
var removeCommand = require('../lib/commands/remove');
var reader = require('../lib/reader');

describe('Remove function', function () {
  var packdownDoc;
  var exampleFile;

  it('removes a file correctly', function () {
    var basicDocument = fs.readFileSync(__dirname + '/docs/example.md');

    packdownDoc = reader(basicDocument);

    packdownDoc.files.length.should.equal(2);

    removeFunction(packdownDoc, 'hello-world.js');

    packdownDoc.files.length.should.equal(1);
  });

  it('does not remove a file that does not exist', function () {
    removeFunction(packdownDoc, 'hello-world.js');
  });
});

describe('Remove command', function () {
  var addPromise;
  var addResult;

  var document = fs.readFileSync(__dirname + '/docs/example.md', 'utf8');

  it('removes a file correctly', function () {
    return removeCommand('hello-world.js', {
      'content': document
    })
      .then(function (res) {
        res.status.should.equal('removed');
      })
  });

  it('does not remove a file that does not exist', function () {
    return removeCommand('foobar', {
      'content': document
    })
      .then(function (res) {
        res.status.should.equal('not found');
      })
  });
});
