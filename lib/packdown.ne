# Packdown Grammar - written in nearley syntax

@{% function NULL () { return null; } %}
@{% function JOIN (d) { return d.join(''); } %}
@{% function IDJOIN (d) { return d[0].join(''); } %}
@{% var files = {}; %}

Document ->
    Content:+ 
      {% function (d) {
        return {
          'files': files,
          'content': d[0]
        }
      } %}

Content ->
    FileBlock
      {% function (d) {
        var file = d[0];
        files[file.name] = file;
        return {
          'file': file.name
        };
      } %}
    | SafeLine {% id %}

FileBlock ->
    FileHeader FileInfo CodeBlock 
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
    ATXHeader " /" PathText "\n"
      {% function (d) { return d[2]; } %}

FileInfo -> 
    SafeBlock
      {% function (d) {
        var data = d[0];
        if (!data.length) return null;
        if (data.length === 1 && data[0] === '') return null;
        return data;
      } %}

CodeBlock ->
    CodeBlockStart SafeBlock "```" "\n"
      {% function (d) {
        return {
          'tag': d[0],
          'content': d[1]
        };
      } %}

CodeBlockStart ->
    "```" CodeBlockTag:? "\n"
      {% function (d) { return d[1]; } %}

# code block tags can't start with dashes
CodeBlockTag ->
    [a-z0-9] [\-a-z0-9]:+ 
      {% function (d) {
        return d[0] + d[1].join('');
      } %}

SafeBlock ->
    SafeLine:* {% id %}

# lines that are safe in a file context - info or code
SafeLine ->
    .:* "\n"
      {% function (d, l, reject) {
        var line = d[0].join('');
        if (line.indexOf('```') === 0) return reject;
        return line;
      } %}

PathText ->  
    [a-zA-Z0-9\.\,\_\-\(\)\/]:+ {% IDJOIN %}

ATXHeader ->
    "#":+
      {% function (d, l, reject) {
        var line = d[0].join('');
        if (line.length > 6) return reject;
        return line;
      }
      %}

# Merge multiple newlines into one
NL ->
    "\n":*
      {% function () { return "\n";} %}

_ ->
    null   {% NULL %}
    | [\s] _  {% NULL %}
