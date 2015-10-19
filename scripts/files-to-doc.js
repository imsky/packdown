/**
 * Converts files array provided by read-dir extras script into
 * document usable by the Packdown writer.
 * @param files Files array where each object has path, ext, and content properties 
 * set to the file relative path, file extension with leading dot, and a Node Buffer
 * of the file content, respectively
 * @param cb Node-style callback function
 */
module.exports = function (files, cb) {
  var document = {
    'name': 'Packdown Document'
  };

  document.files = files.map(function (file) {
    var tag = file.ext.slice(1);

    return {
      'name': file.path,
      'tag': tag,
      'content': new Buffer(file.content).toString('utf8')
    };
  });

  cb(null, document);
};