var fs = require('fs');

var chai = require('chai');
chai.should();

var reader = require('../lib/reader');
var basicDocument = fs.readFileSync(__dirname + '/docs/basic.md', 'utf8');
var basicResult = require('./docs/basic.json');
var edgeCaseDocument = fs.readFileSync(__dirname + '/docs/edge-case.md', 'utf8');

describe('Reader', function () {
  it('should read a basic document', function () {
    var output = reader(basicDocument);

    output.name.should.equal(basicResult.name);
    output.info.join('').should.equal(basicResult.info);
    output.files.length.should.equal(1);
  });

  it('should read an edge-case document', function () {
    var output = reader(edgeCaseDocument);
    output.files.length.should.equal(3);
  });

  it('should fail with an invalid document', function () {
    (function () {
      reader('foobar');
    }).should.throw(Error);
  })
});