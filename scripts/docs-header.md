# Packdown

Packdown stores files inside Markdown documents.

[![Build Status](https://travis-ci.org/imsky/packdown.svg?branch=master)](https://travis-ci.org/imsky/packdown)
[![codecov.io](https://codecov.io/github/imsky/packdown/coverage.svg?branch=master)](https://codecov.io/github/imsky/packdown)

## Installation

* [npm](https://www.npmjs.com/package/packdownjs): `npm install -g packdownjs`

## Command line usage

```
Usage: packdown [options] [command]

Commands:

  compress <input> [output]         
  extract [options] <input> <output>
  add <file> <document>             
  remove <file> <document>          

Options:

  -h, --help     output usage information
  -V, --version  output the version number

Examples:
  compress <input> [output]
    $ packdown compress foo bar  # compresses foo dir into bar file
    $ packdown compress foo      # compresses foo dir, sends to stdout
  extract [options] <input> <output>
    $ packdown extract foo bar   # extracts foo file into bar directory
    # templates foo file with vars.json, then extracts into bar directory
    $ packdown extract -v vars.json foo bar
  add <file> <document>
    $ packdown add foo bar       # adds foo to bar document at /foo path
  remove <file> <document>
    $ packdown remove foo bar    # removes /foo path from bar document
```
