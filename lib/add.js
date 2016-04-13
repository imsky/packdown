/**
 * Add a file object to a document object
 * @method addFunction
 * @param {Object} document
 * @param {Object} file
 * @return A file already existing at the added path or null
 */
module.exports = function addFunction (document, file) {
  var oldFile = document.files[file.name] ? document.files[file.name] : null;

  document.files[file.name] = file;

  if (!oldFile) {
    document.content.push({
      'file': file.name
    });
  }

  return oldFile;
};