# ypst-template

`ypst-template` is a Typst document theme extracted from
`E:\til\appx\theme.typ`. It provides:

- page layout, CJK typography, and heading styles;
- sidenotes, theorem, lemma, corollary, definition, and proof environments;
- Mermaid, Fletcher diagram, and multiline equation helpers;
- theme CSS and sidenotes JavaScript for HTML output.

## Current availability

This package currently supports **local use only**. It has not been published
to Typst Universe.

Install the package at:

```text
%APPDATA%\typst\packages\local\ypst-template\0.1.0\
```

The directory should contain `typst.toml`, `lib.typ`, `html.typ`, `theme.css`,
and `sidenotes.js`.

Use it from a Typst document:

```typst
#import "@local/ypst-template:0.1.0": template, sidenote, theorem
#show: template

#sidenote[Main text][Side note]
```

For HTML output:

```text
typst compile --features html note.typ note.html
```

The package directory layout, manifest, and local package path follow the
standard Typst packages format.
