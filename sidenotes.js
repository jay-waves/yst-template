// Turn Typst HTML footnotes into Tufte-style sidenotes.
// This is intentionally DOM-only: Typst emits semantic footnote markup, and
// this normalizes both its aside and endnote representations.
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

    // Typst's HTML exporter currently emits native `#footnote[...]` values as
    // endnotes instead of asides. Normalize those entries to the same shape
    // before looking up references, so the placement logic below can handle
    // both exporter representations.
    function normalizeEndnotes(root) {
        root.querySelectorAll('[role="doc-endnotes"] li[id]').forEach(item => {
            const aside = document.createElement('aside');
            aside.id = item.id;
            aside.setAttribute('role', 'doc-footnote');

            const backlink = item.querySelector('sup[role="doc-backlink"]');
            if (backlink) {
                const marker = document.createElement('span');
                marker.className = 'sidenote-number';
                marker.textContent = backlink.textContent.trim();
                aside.append(marker, document.createTextNode(' '));
                backlink.remove();
            }

            while (item.firstChild) aside.appendChild(item.firstChild);
            item.replaceWith(aside);
        });
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
        normalizeEndnotes(root);

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
