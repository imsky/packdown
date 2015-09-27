# Packdown parser

@{% function NULL () { return null; } %}

newline -> "\n"

_ -> null {% NULL %}
  | _ [\s] {% NULL %}