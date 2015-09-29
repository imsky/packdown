# Packdown parser

@{% function NULL () { return null; } %}

Document ->
    Preamble DocHeader

Preamble ->
    "<!-- packdown-" FormatVersion "-" ParserVersion " -->" NL
      {% function (d) {
        return {
          format: d[1],
          version: d[2]
        };
      } %}

DocHeader ->
    "# " HeadingText NL {% function (d) { return d[1]; } %}

HeadingText -> null
  | HeadingText [ a-zA-Z0-9\.\,\+\=\(\)\@\#\$\%\^\&\*\~\"\'\-\?\!] 
      {%  function (d) {
        return d[0] + d[1];
      } %}

FormatVersion ->
    int

ParserVersion ->
    int "." int "." int

int ->
    [0-9]     {% id %}
  | int [0-9] {% function (d) { return d[0] + d[1]; } %}

# Merge multiple newlines into one
NL -> "\n":* {% function () { return "\n";} %}

_ -> null   {% NULL %}
  | [\s] _  {% NULL %}