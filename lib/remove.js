/**
 * Remove a file at specified path from a Packdown document
 * @method remove
 * @param {} document
 * @param {} path
 * @return The deleted file, if any, or null
 */
module.exports = function remove (document, path) {
  var oldFile = document.files[path] ? document.files[path] : null;

  if (oldFile) {
    delete document.files[path];

    if (Array.isArray(document.content)) {
      document.content = document.content.filter(function (chunk) {
        return typeof chunk === 'string' || chunk.file !== path;
      });
    }
  }

  return oldFile;
};