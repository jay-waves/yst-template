// Turn Typst HTML footnotes into Tufte-style sidenotes.
// This is intentionally DOM-only: Typst already emits semantic footnote
// asides, so no Markdown parser dependency is required.
(function () {
    function blockFor(reference) {
        return reference.closest(
            'p, li, blockquote, figure, h1, h2, h3, h4, h5, h6, pre, table'
        ) || reference.parentElement;
    }

    function isFootnote(aside) {
        return aside.matches(
            '[role="doc-footnote"], .footnote, .footnotes aside, [data-footnote]'
        ) || /^footnote[-_]/i.test(aside.id || '');
    }

    function references(root) {
        return Array.from(root.querySelectorAll('a[href^="#"], [role="doc-noteref"]'))
            .filter(reference => {
                const href = reference.getAttribute('href');
                const targetId = href && href.slice(1);
                return targetId && root.ownerDocument.getElementById(targetId);
            });
    }

    function moveSidenotes(root) {
        const notes = new Map(
            Array.from(root.querySelectorAll('aside[id]'))
                .filter(isFootnote)
                .map(note => [note.id, note])
        );
        if (!notes.size) return;

        const placed = new Set();
        for (const reference of references(root)) {
            const href = reference.getAttribute('href');
            const note = notes.get(href && href.slice(1));
            if (!note || placed.has(note.id)) continue;

            const block = blockFor(reference);
            if (!block || note.contains(block)) continue;
            block.insertAdjacentElement('afterend', note);
            note.setAttribute('role', 'doc-footnote');
            placed.add(note.id);
        }

        // Typst may wrap notes in a footnotes section. Once every note has
        // been moved, remove only the now-empty wrapper.
        root.querySelectorAll('.footnotes, [role="doc-endnotes"]').forEach(wrapper => {
            if (!wrapper.querySelector('aside[id]')) wrapper.remove();
        });
    }

    function start() {
        moveSidenotes(document.body);
    }

    window.typstSidenotes = moveSidenotes;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
