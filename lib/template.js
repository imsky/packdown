var templayed = require('../vendor/templayed');

/**
 * Render a Mustache template
 * @method exports
 * @param {String} template - The template to render
 * @param {Object} variables - The values used within template
 * @return String
 */
module.exports = function (template, variables) {
  return templayed(template)(variables);
};
