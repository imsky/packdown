# Edge case document

This document ends without a newline, which is required after a code block.

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

## /bar

This file has mixed encoding, so will be treated as not space encoded.

```txt

    this line is space-encoded
this line is not
```