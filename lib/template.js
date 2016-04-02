var templayed = require('../vendor/templayed');

exports.template = function (template) {
  return templayed(template);
};

exports.render = function (template, variables) {
  return template(variables);
};
