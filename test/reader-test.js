var fs = require('fs');

var chai = require('chai');
chai.should();

var reader = require('../lib/reader');
var fixtures = require('./fixtures');

var basicDocument = fixtures.documents.basic;
var basicResult = require('./docs/basic.json');
var edgeCaseDocument = fixtures.documents.edgeCase;

describe('Reader', function () {
  it('should read a basic document', function () {
    var output = reader(basicDocument);

    Object.keys(output.files).length.should.equal(1);

    output = reader(basicDocument, {'disableSpaceEncoding': true});
  });

  it('should read an edge-case document', function () {
    var output = reader(edgeCaseDocument);
    Object.keys(output.files).length.should.equal(3);
  });
});
