var fs = require('fs');

var chai = require('chai');
chai.should();

var reader = require('../lib/reader');
var basicDocument = fs.readFileSync(__dirname + '/docs/basic.md', 'utf8');
var basicResult = require('./docs/basic.json');

describe('Reader', function () {
  it('should read a basic document', function () {
    var output = reader(basicDocument);

    output.name.should.equal(basicResult.name);
    output.info.join('').should.equal(basicResult.info);
    output.files.length.should.equal(1);
  });
});