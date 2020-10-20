require('shelljs/global');

var package = require('../package');

var version = package.version;

var year = (new Date()).getFullYear();

var banner = [
'/*!',
'',
'Packdown - Markdown-based file container format',
'Version PACKDOWN_VERSION',
'(c) 2015-' + year + ' Ivan Malopinsky - http://imsky.co',
'',
'License: MIT',
'Issues:  https://github.com/imsky/packdown/issues',
'',
'*/',
''
];

banner.join('\n').to('banner.txt');

cat('banner.txt', 'dist/packdown.js').to('dist/packdown.js');
sed('-i', 'PACKDOWN_VERSION', version, 'dist/packdown.js');
cat('banner.txt', 'dist/packdown.min.js').to('dist/packdown.min.js');
sed('-i', 'PACKDOWN_VERSION', version, 'dist/packdown.min.js');
rm('banner.txt');
