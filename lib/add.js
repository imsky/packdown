module.exports = function (document, file) {
  var oldFile = null;

  document.files.forEach(function (_file, index) {
    if (_file.name === file.name) {
      oldFile = _file;
      document.files[index] = file;
    }
  });

  if (!oldFile) {
    document.files.push(file);
  }

  return oldFile;
};