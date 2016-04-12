# Packdown Grammar - written in nearley syntax
# Thanks to Hardmath123 <https://github.com/Hardmath123> for help

@{% function IDJOIN (d) { return d[0].join(''); } %}

Document ->
    Content:+ 
      {% function (d) {
        var content = d[0];
        var files = {};

        content = content.map(function (chunk) {
          if (typeof chunk === 'string') {
            return chunk;
          } else if (chunk.name && chunk.content) {
            files[chunk.name] = chunk;
            return {
              'file': chunk.name
            };
          }
        });

        return {
          'files': files,
          'content': content
        };
      } %}

Content ->
    FileBlock {% id %}
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
        if (/^\#{1,6} \//.test(line)) return reject;
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
    null
    | [\s] _
