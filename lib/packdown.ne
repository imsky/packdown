# Packdown parser

@{% function NULL () { return null; } %}
@{% function CONCAT (d) { return d[0] + d[1]; } %}
@{% function JOIN (d) { return d.join(''); } %}
@{% function IDJOIN (d) { return d[0].join(''); } %}

Document ->
    Preamble DocHeader FileList
      {% function (d) {
        return {
          'preamble': d[0],
          'document': d[1],
          'files': d[2]
        };
      } %}

Preamble ->
    "<!-- packdown-" int "-" ParserVersion " -->" NL
      {% function (d) {
        return {
          format: d[1],
          version: d[3]
        };
      } %}

DocHeader ->
    "# " HeadingText NL {% function (d) { return d[1]; } %}

FileList ->
    FileBlock:+ {% id %}

FileBlock ->
    FileHeader CodeBlock NL 
      {% function (d) {
        return {
          'path': d[0],
          'lines': d[1]
        };
      } %}

FileHeader ->
    "## " PathText NL {% function (d) { return d[1]; } %}

CodeBlock ->
    #todo: extract language tag
    #todo: check if trailing "```\n" makes sense
    "```" "\n" CodeText "```" {% function (d) { return d[2]; } %}

CodeText ->
    CodeLine:* {% id %}

CodeLine ->
    .:+ "\n" {% IDJOIN %}

HeadingText ->
    [^\n]:+ {% IDJOIN %}

PathText ->  
    [a-z0-9\.\-\/]:+ {% IDJOIN %}

ParserVersion ->
    int "." int "." int {% JOIN %}

int ->
    [0-9]:+ {% IDJOIN %}

# Merge multiple newlines into one
NL ->
    "\n":* {% function () { return "\n";} %}

_ ->
  null   {% NULL %}
  | [\s] _  {% NULL %}