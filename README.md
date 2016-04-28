# Packdown

Packdown stores files inside Markdown documents.

[![Build Status](https://travis-ci.org/imsky/packdown.svg?branch=master)](https://travis-ci.org/imsky/packdown)
[![codecov.io](https://codecov.io/github/imsky/packdown/coverage.svg?branch=master)](https://codecov.io/github/imsky/packdown)

## Installation

* [npm](https://www.npmjs.com/package/packdownjs): `npm install -g packdownjs`

## Command line usage


### Extracting a document

```
packdown extract doc.md outdir
```

Packdown can also extract from standard input:

```
cat doc.md | packdown extract - outdir
```

### Extracting a document with a template

```
packdown template doc.md vars.json outdir
```

### Compressing a directory

```
packdown compress indir doc.md
```

Packdown output can also be redirected:

```
packdown compress indir | grep foo
```

### Adding a file to a document

```
packdown add doc.md file.txt
```

### Removing a file from a document

```
packdown remove doc.md file.txt
```

## Building

Packdown uses npm scripts and [shelljs](https://github.com/shelljs/shelljs) for building.

```
npm run build
```

## Testing

Packdown uses [Mocha](https://github.com/mochajs/mocha) and [Istanbul](https://github.com/gotwarlost/istanbul) for testing and coverage.

```
npm test
```

## Source

* GitHub: <https://github.com/imsky/packdown>
* GitLab: <https://gitlab.com/imsky/packdown>

## License

Packdown is provided under the [MIT License](http://opensource.org/licenses/MIT).

## Credits

Packdown is a project by [Ivan Malopinsky](http://imsky.co).
