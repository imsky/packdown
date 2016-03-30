module.exports = function (document, file) {
  var oldFile = document.files[file.name] ? document.files[file.name] : null;

  document.files[file.name] = file;

  if (!oldFile) {
    document.content.push({'file': file.name});
  }

  return oldFile;
};