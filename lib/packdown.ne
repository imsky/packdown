# Packdown Grammar - written in nearley syntax

@{% function NULL () { return null; } %}
@{% function CONCAT (d) { return d[0] + d[1]; } %}
@{% function JOIN (d) { return d.join(''); } %}
@{% function IDJOIN (d) { return d[0].join(''); } %}

Document ->
    Preamble DocHeader FileList
      {% function (d) {
        return {
          'preamble': d[0],
          'title': d[1],
          'files': d[2]
        };
      } %}

Preamble ->
    "<!-- packdown-" int "-" SemVer " -->" NL
      {% function (d) {
        return {
          formatVersion: d[1],
          packageVersion: d[3]
        };
      } %}

DocHeader ->
    "# " HeadingText NL {% function (d) { return d[1]; } %}

FileList ->
    FileBlock:+ {% id %}

FileBlock ->
    FileHeader FileInfo CodeBlock NL 
      {% function (d) {
        var data = d[2];
        var retval = {
          'name': d[0],
          'info': d[1],
          'tag': data.tag,
          'content': data.content
        };
        data = null;
        return retval;
      } %}

FileHeader ->
    "## " PathText "\n" {% function (d) { return d[1]; } %}

FileInfo -> 
    TextBlock 
      {% function (d) {
        var data = d[0];
        if (!data.length) return null;
        if (data.length === 1 && data[0] === '') return null;
        return data;
      } %}

CodeBlock ->
    CodeBlockStart TextBlock "```"
      {% function (d) {
        return {
          'tag': d[0],
          'content': d[1]
        };
      } %}

CodeBlockStart ->
    "```" CodeBlockTag:? "\n" {% function (d) { return d[1]; } %}

# code block tags can't start with dashes
CodeBlockTag ->
    [a-z0-9] [\-a-z0-9]:+ 
      {% function (d) {
        return d[0] + d[1].join('');
      } %}

TextBlock ->
    TextLine:* {% id %}

TextLine ->
    .:* "\n" {% function (d, l, reject) {
    var line = d[0].join('');
    if (line.indexOf('```') === 0) return reject;
    return line;
    } %}

CodeLine ->
    .:* "\n" {% IDJOIN %}

HeadingText ->
    [^\n]:+ {% IDJOIN %}

PathText ->  
    [a-z0-9\.\-\/]:+ {% IDJOIN %}

SemVer ->
    int "." int "." int {% JOIN %}

int ->
    [0-9]:+ {% IDJOIN %}

# Merge multiple newlines into one
NL ->
    "\n":* {% function () { return "\n";} %}

_ ->
  null   {% NULL %}
  | [\s] _  {% NULL %}