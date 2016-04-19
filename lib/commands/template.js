var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('./utilities');
var extract = require('./extract');

/**
 * Extract a Packdown document as templated files
 * @param {String} input - Path to input file
 * @param {Object} variables - Context to use in template
 * @param {String} output - Output path
 * @return {Promise}
 */
module.exports = function TemplateCommand (input, variables, output) {
  var documentObj = utilities.getFile(input);
  var variablesObj = utilities.getFile(variables);

  return promise.resolve(true)
    .then(function parseTemplateVariables () {
      return JSON.parse(variablesObj.content);
    })
    .then(function templateResult (variables) {
      return packdown.template(documentObj.content, variables);
    })
    .then(function extractResult (res) {
      return extract(new Buffer(res), output || documentObj.name);
    });
};
