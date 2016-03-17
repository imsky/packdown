var fs = require('fs');

var package = require('../package');

var version = {
  'package': package.version,
  'format': package.formatVersion
};

var banner = [
'/*!',
'',
'Packdown - Markdown-based file container format',
'Version ' + version.package,
'(c) 2015-2016 Ivan Malopinsky - http://imsky.co',
'',
'License: MIT',
'Issues:  https://github.com/imsky/packdown/issues',
'',
'*/',
''
];

fs.writeFileSync('packdown-version.json', JSON.stringify(version));
fs.writeFileSync('packdown-banner.txt', banner.join('\n'));