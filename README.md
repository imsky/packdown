# Packdown

Packdown stores files in a Markdown document.

[![Build Status](https://travis-ci.org/imsky/packdown.svg?branch=master)](https://travis-ci.org/imsky/packdown)
[![codecov.io](https://codecov.io/github/imsky/packdown/coverage.svg?branch=master)](https://codecov.io/github/imsky/packdown?branch=master)

## Installing

* [npm](https://www.npmjs.com/package/packdownjs): `npm install -g packdownjs`

## What is Packdown?

Packdown is a document format, a library, and a CLI tool that helps pack many files into one. Unlike zip, 7z, or tar, Packdown is human-readable and editable. It's a subset of Markdown so it's widely supported out of the box. It's extensible and works in browsers, on servers, and on the command line.

Every file inside of a Packdown document can have a rich description. This makes Packdown documents useful as tutorials, templates, code snippet collections, etc. More than just a container, a Packdown document adds context to a file collection, providing utility to the reader, and reducing management complexity for the author.

## Structure

The structure of a Packdown document is as follows:

* Document title and info
* List of file blocks that consist of the following:
  * Path of the file
  * File info
  * File contents in a code block
* Optional comment with Packdown version metadata

## Example

<pre>
&#35; Example

This is an example Packdown document. This block supports &#42;&#42;Markdown&#42;&#42;.

&#35;&#35;&#35; /file.txt

&#96;&#96;&#96;txt
Hello world
&#96;&#96;&#96;
</pre>

## Command line usage

```
Usage: packdown [options] [command]


Commands:

  compress <input> [output]  compress <input> and save to [output]
  extract <input> <output>   extract <input> Packdown doc into <output> directory

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```

## License

Packdown is provided under the [MIT License](http://opensource.org/licenses/MIT).

## Credits

Thanks to [@hardmath123](https://github.com/Hardmath123) for help with the parser grammar.

Packdown is a project by [Ivan Malopinsky](http://imsky.co).
