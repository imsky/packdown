const banner = require('rollup-plugin-banner');
const buble = require('@rollup/plugin-buble');
const replace = require('@rollup/plugin-replace');
const { uglify } = require('rollup-plugin-uglify');

const packageJSON = require('./package.json');

const { name, friendlyName, summary } = packageJSON.build;
const { author, version } = packageJSON;

function rollup({ minify }) {
  const bannerText = [
    `${friendlyName} - ${summary}`,
    `Version ${version}`,
    `© ${(new Date).getFullYear()} ${author}`
  ].join('\n');

  const file = [name, minify && 'min', 'js'].filter(Boolean).join('.');

  return {
    input: 'src/index.js',
    output: {
      file: `dist/${file}`,
      format: 'umd',
      name: friendlyName
    },
    plugins: [
      replace({
        'VERSION': version
      }),
      buble({
        transforms: {
          dangerousForOf: true
        }
      }),
      minify ? uglify({ sourcemap: false }) : null,
      banner.default(bannerText)
    ].filter(Boolean)
  };
}

const builds = [];

for (const minify of [true, false]) {
  builds.push(rollup({ minify }));
}

module.exports = builds;
