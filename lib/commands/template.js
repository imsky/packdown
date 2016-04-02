var path = require('path');

var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('../utilities');
var extract = require('./extract');

module.exports = function (input, variables, output) {
  var documentObj = utilities.getFile(input);
  var variablesObj = utilities.getFile(variables);

  return promise.resolve(true)
    .then(function () {
      return JSON.parse(variablesObj.content);
    })
    .then(function (variables) {
      return packdown.template(documentObj.content, variables);
    })
    .then(function (res) {
      return extract(new Buffer(res), output || documentObj.name);
    });
};
