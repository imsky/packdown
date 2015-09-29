# Packdown parser

@{% function NULL () { return null; } %}
@{% function CONCAT (d) { return d[0] + d[1]; } %}
@{% function JOIN (d) { return d.join(''); } %}

Document ->
    Preamble DocHeader FileList

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
    FileBlock:+

FileBlock ->
    "## " PathText NL

HeadingText -> null
  | HeadingText [ a-zA-Z0-9\.\,\+\=\(\)\@\#\$\%\^\&\*\~\"\'\-\?\!] 
      {% CONCAT %}

PathText ->  [a-z0-9\.\-\/]:+ {% function (d) { return d[0].join(''); } %}

ParserVersion ->
    int "." int "." int {% JOIN %}

int ->
    [0-9]     {% id %}
  | int [0-9] {% CONCAT %}

# Merge multiple newlines into one
NL -> "\n":* {% function () { return "\n";} %}

_ -> null   {% NULL %}
  | [\s] _  {% NULL %}