var fs = require('fs');
var path = require('path');

exports.documents = {
  'basic': fs.readFileSync(path.join(__dirname, 'docs', 'basic.md'), 'utf8'),
  'edgeCase': fs.readFileSync(path.join(__dirname, 'docs', 'edge-case.md'), 'utf8'),
  'example': fs.readFileSync(path.join(__dirname, 'docs', 'example.md'), 'utf8')
};
