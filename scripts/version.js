require('shelljs/global');

var fs = require('fs');

var package = require('../package');

var version = package.version;

var banner = [
'/*!',
'',
'Packdown - Markdown-based file container format',
'Version PACKDOWN_VERSION',
'(c) 2015-2016 Ivan Malopinsky - http://imsky.co',
'',
'License: MIT',
'Issues:  https://github.com/imsky/packdown/issues',
'',
'*/',
''
];

var bannerText = banner.join('\n').to('banner.txt');

cat('banner.txt', 'packdown.js').to('packdown.js');
sed('-i', 'PACKDOWN_VERSION', version, 'packdown.js');
cat('banner.txt', 'packdown.min.js').to('packdown.min.js');
sed('-i', 'PACKDOWN_VERSION', version, 'packdown.min.js');
rm('banner.txt');
