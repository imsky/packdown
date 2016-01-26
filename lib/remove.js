module.exports = function (document, path) {
  var oldFile = null;

  document.files.forEach(function (file, index) {
    if (file.name === path) {
      oldFile = file;
      document.files[index] = null;
    }
  });

  if (oldFile) {
    document.files = document.files.filter(Boolean);
  }

  return oldFile;
};