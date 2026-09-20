/// HTML-specific rendering helpers for the document theme.

/// Render a sidenote as a semantic HTML footnote aside.
#let sidenote(body, aside) = {
    body
    html.elem(
        "aside",
        attrs: (role: "doc-footnote"),
        aside,
    )
}

/// Apply the HTML-safe layout rules and inject the package assets.
#let template(body, theme) = {
    // Typst's HTML exporter does not translate PDF layout rules. Keep the
    // semantic elements and let the browser styles arrange them.
    show align: it => {
        let horizontal = it.alignment.x
        let css-align = if horizontal == center {
            "center"
        } else if horizontal == right or horizontal == end {
            "right"
        } else {
            "left"
        }
        html.elem("div", attrs: (style: "text-align: " + css-align), it.body)
    }
    // Pad is also discarded by the exporter, including nested theorem text.
    show pad: it => it.body
    show grid.cell: it => it.body
    show grid: it => it.children.map(child => html.elem("div", child)).join()
    show stack: it => it.children.map(child => html.elem("div", child)).join()
    show place: it => it.body
    html.elem("style", attrs: ("data-theme": theme), read("theme.css"))
    html.elem("style", attrs: ("data-sidenotes": ""), read("sidenotes.css"))
    html.elem("script", read("sidenotes.js"))
    body
}
