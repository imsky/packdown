# Packdown

Packdown stores files in a Markdown document.

## Installing

* [npm](https://www.npmjs.com/package/packdownjs): `npm install packdownjs`

## About

Packdown is a subset of Markdown, which means it can be rendered by most Markdown libraries, especially [CommonMark](http://commonmark.org/)-compatible ones. This makes it versatile as both a storage format and a presentation format.

The structure of a Packdown document is as follows:

* Document title and info
* List of file blocks that consist of the following:
  * Path of the file
  * File info
  * File contents in a code block

## Example

<pre>
# Example

This is an example Packdown document. This block supports **Markdown**.

## file.txt

&#x60;&#x60;&#x60;txt
Hello world
&#x60;&#x60;&#x60;
</pre>

## License

Packdown is provided under the [MIT License](http://opensource.org/licenses/MIT).

## Credits

Thanks to [@hardmath123](https://github.com/Hardmath123) for help with the parser grammar.

Packdown is a project by [Ivan Malopinsky](http://imsky.co).