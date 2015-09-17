function heading (document) {
  var ret = [];

  ret.push('# ' + document.title);

  if (document.description) {
    ret.push(document.description);
  }

  return ret.join('\n');
}

function block (file) {
  var ret = [];

  ret.push('## ' + file.path);

  if (file.description) {
    ret.push(file.description);
  }

  ret.push('```' + (file.language || ''));
  ret.push(file.content);
  ret.push('```');

  return ret.join('\n');
}

exports.write = function (document, files) {
  if (!Array.isArray(files)) throw Error('File list is not an array');

  var ret = [];

  ret.push(heading(document));

  for(var i = 0, l = files.length; i < l; i++) {

  }
};