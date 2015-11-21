# Packdown

Packdown stores files in a Markdown document.

## Installing

* [npm](https://www.npmjs.com/package/packdownjs): `npm install packdownjs`

## What is Packdown?

Packdown is a document format, a library, and a CLI tool that helps pack many files into one. Unlike zip, 7z, tar, or other archive formats, Packdown is human-readable and editable. It's a subset of Markdown so it's widely supported out of the box. Finally, every file in a Packdown document can be annotated, so instructions and explanations can be stored alongside the files they apply to.

Packdown can be used for tutorials, boilerplate, configuration templates, literate programming, code snippets, and tons more. It's extensible and works in the browser and on the command line.

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

&#35;&#35; file.txt

&#96;&#96;&#96;txt
Hello world
&#96;&#96;&#96;
</pre>

## Command line usage

```
Usage: packdown [options] [command]


Commands:

  compress|c <input> [output]  create Packdown doc from <input> directory and optionally write it to [output]
  extract|e <input> <output>   extract <input> Packdown doc into <output> directory

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```

### Examples

```
packdown compress docs docs.md
packdown c docs > docs.md
packdown extract docs.md example
```

## License

Packdown is provided under the [MIT License](http://opensource.org/licenses/MIT).

## Credits

Thanks to [@hardmath123](https://github.com/Hardmath123) for help with the parser grammar.

Packdown is a project by [Ivan Malopinsky](http://imsky.co).
