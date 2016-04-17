var fs = require('fs');
var mock = require('mock-fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var packdown = require('../index');
var fixtures = require('./fixtures');

var basicDoc = fixtures.documents.basic;

describe('Template function', function () {
  it('works with a basic example', function () {
    var output = packdown.template(basicDoc, {'foo': 'baz'}); 
    var doc = packdown.read(output);
    doc.files['hello-world'].content[0].should.equal('baz');
  });
});

describe('Template command', function () {});
