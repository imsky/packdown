## /foo

This file is not space encoded.

```txt
not space

encoded
```

## /empty

This file is empty.

```txt
```

####### /badfile

This file has an invalid header. If it had a code block, the parser would fail.

## /bar

This file has mixed encoding, so will be treated as not space encoded.

```txt

    this line is space-encoded
this line is not
```