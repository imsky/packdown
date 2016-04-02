var templayed = require('../vendor/templayed');

module.exports = function (template, variables) {
  return templayed(template)(variables);
};
