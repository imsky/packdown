var fs = require('fs');

var package = require('../package');

var metadata = {
  'packageVersion': package.version,
  'formatVersion': package.formatVersion
};

var banner = [
'/*!',
'',
'Packdown - Markdown-based file container format',
'Version ' + package.version,
'Format Version ' + package.formatVersion,
'(c) 2015-2016 Ivan Malopinsky - http://imsky.co',
'',
'License: MIT',
'Issues:  https://github.com/imsky/packdown/issues',
'',
'*/',
''
];

fs.writeFileSync('packdown-metadata.json', JSON.stringify(metadata));
fs.writeFileSync('packdown-banner.txt', banner.join('\n'));