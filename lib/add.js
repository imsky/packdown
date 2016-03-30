module.exports = function (document, file) {
  var oldFile = null;

  if (document.files[file.name]) {
    oldFile = document.files[file.name];
  }

  document.files[file.name] = file;

  if (!oldFile) {
    document.content.push({'file': file.name});
  }

  return oldFile;
};