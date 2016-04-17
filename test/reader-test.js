var fs = require('fs');

var chai = require('chai');
chai.should();

var packdown = require('../index');
var fixtures = require('./fixtures');

var basicDocument = fixtures.documents.basic;
var basicResult = require('./docs/basic.json');
var edgeCaseDocument = fixtures.documents.edgeCase;

describe('Reader', function () {
  it('should read a basic document', function () {
    var output = packdown.read(basicDocument);

    Object.keys(output.files).length.should.equal(1);

    output = packdown.read(basicDocument, {'disableSpaceEncoding': true});
  });

  it('should read an edge-case document', function () {
    var output = packdown.read(edgeCaseDocument);
    Object.keys(output.files).length.should.equal(3);
  });
});
