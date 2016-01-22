require('shelljs/global');

cat('packdown-banner.txt', 'packdown.js').to('packdown.js');
cat('packdown-banner.txt', 'packdown.min.js').to('packdown.min.js');