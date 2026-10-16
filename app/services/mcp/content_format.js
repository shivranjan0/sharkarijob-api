export function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function safeUrl(url) {
    const trimmed = String(url ?? '').trim();
    if (!/^https?:\/\//i.test(trimmed))
        return null;
    return escapeHtml(trimmed);
}
export function inline(text) {
    let out = escapeHtml(text ?? '');
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/gi, (whole, label, url) => {
        const href = safeUrl(url);
        if (!href)
            return whole;
        return `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
    });
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
    return out;
}
function card(heading, body) {
    return [
        '<table>',
        '<thead>',
        `<tr><th>${escapeHtml(heading)}</th></tr>`,
        '</thead>',
        '<tbody>',
        `<tr><td>${body}</td></tr>`,
        '</tbody>',
        '</table>',
    ].join('\n');
}
function renderSection(section) {
    switch (section.kind) {
        case 'heading':
            return `<h2>${escapeHtml(section.text)}</h2>`;
        case 'paragraph':
            return `<p>${inline(section.text)}</p>`;
        case 'card':
            return card(section.heading, inline(section.body));
        case 'table': {
            const rows = section.rows
                .map((row) => `<tr><td><strong>${inline(row.label)}</strong></td><td>${inline(row.value)}</td></tr>`)
                .join('\n');
            return [
                '<table>',
                '<thead>',
                `<tr><th colspan="2">${escapeHtml(section.heading)}</th></tr>`,
                '</thead>',
                `<tbody>\n${rows}\n</tbody>`,
                '</table>',
            ].join('\n');
        }
        case 'grid': {
            const head = section.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join('');
            const rows = section.rows
                .map((cells) => `<tr>${cells.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
                .join('\n');
            return [
                '<table>',
                '<thead>',
                `<tr><th colspan="${section.columns.length}">${escapeHtml(section.heading)}</th></tr>`,
                `<tr>${head}</tr>`,
                '</thead>',
                `<tbody>\n${rows}\n</tbody>`,
                '</table>',
            ].join('\n');
        }
        case 'list': {
            const tag = section.ordered ? 'ol' : 'ul';
            const items = section.items.map((item) => `<li>${inline(item)}</li>`).join('\n');
            const heading = section.heading ? `<h2>${escapeHtml(section.heading)}</h2>\n` : '';
            return `${heading}<${tag}>\n${items}\n</${tag}>`;
        }
        case 'links': {
            const rows = section.links
                .map((link) => {
                const href = safeUrl(link.url);
                const label = escapeHtml(link.label);
                if (!href)
                    return '';
                return `<tr><td><strong>${label}</strong></td><td><a href="${href}" target="_blank" rel="noopener">Click Here</a></td></tr>`;
            })
                .filter(Boolean)
                .join('\n');
            if (!rows)
                return '';
            return [
                '<table>',
                '<thead>',
                `<tr><th colspan="2">${escapeHtml(section.heading ?? 'Important Links')}</th></tr>`,
                '</thead>',
                `<tbody>\n${rows}\n</tbody>`,
                '</table>',
            ].join('\n');
        }
        case 'faq': {
            const items = section.items
                .map((item) => `<li><strong>Question:</strong> ${escapeHtml(item.question)}<br><strong>Answer:</strong> ${inline(item.answer)}</li>`)
                .join('\n');
            return card(section.heading ?? 'Important Questions', `<ul>\n${items}\n</ul>`);
        }
        default: {
            const unreachable = section;
            return unreachable;
        }
    }
}
export function renderSections(sections) {
    return sections.map(renderSection).filter(Boolean).join('\n\n');
}
const KILL_CLASS = [
    /^gizmo[\w-]*$/,
    /^flex$/, /^inline-flex$/, /^flex-col$/, /^flex-row$/, /^flex-shrink-\d+$/, /^shrink-\d+$/,
    /^grow(-\d+)?$/, /^flex-grow(-\d+)?$/,
    /^items-(start|end|center|baseline|stretch)$/,
    /^justify-\w+$/,
    /^[wh]-\d+(\.\d+)?$/, /^[wh]-(full|screen|auto|px)$/,
    /^min-[wh]-\w+$/, /^max-[wh]-\w+$/,
    /^overflow(-[xy])?-(hidden|auto|scroll|clip)$/,
    /^rounded(-\w+)?$/,
    /^absolute$/, /^relative$/, /^fixed$/, /^sticky$/,
    /^[pm][trblxy]?-\d+(\.\d+)?$/,
    /^gap-\d+$/, /^space-[xy]-\d+$/,
    /^text-(xs|sm|base|lg|xl|\dxl)$/,
    /^bg-\w+-\d+$/, /^text-\w+-\d+$/,
];
const COMPETITORS = /sarkariresult\.com(\.cm)?|sarkariresult|sarkarijob\.bluraj\.com/gi;
export function normaliseHtml(html) {
    const notes = [];
    let out = String(html ?? '');
    const drop = (pattern, note) => {
        const before = out;
        out = out.replace(pattern, '');
        if (out !== before)
            notes.push(note);
    };
    drop(/<script\b[\s\S]*?<\/script\s*>/gi, 'removed <script> blocks');
    drop(/<style\b[\s\S]*?<\/style\s*>/gi, 'removed <style> blocks');
    drop(/<\/?(?:html|head|body|meta|link|base|form|input|button|iframe|object|embed)\b[^>]*>/gi, 'removed page-level and interactive tags');
    drop(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, 'removed inline event handlers');
    drop(/\s(?:href|src)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'removed javascript: URLs');
    let classesCleaned = 0;
    out = out.replace(/\sclass="([^"]*)"/gi, (whole, value) => {
        const all = value.split(/\s+/).filter(Boolean);
        const kept = all.filter((cls) => !KILL_CLASS.some((re) => re.test(cls)));
        if (kept.length === all.length)
            return whole;
        classesCleaned++;
        return kept.length ? ` class="${kept.join(' ')}"` : '';
    });
    if (classesCleaned)
        notes.push(`stripped layout classes from ${classesCleaned} elements`);
    const before = out;
    out = out.replace(/<a\b[^>]*href="[^"]*(?:sarkariresult|bluraj)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, '$1');
    out = out.replace(COMPETITORS, 'Sharkari Job');
    if (out !== before)
        notes.push('replaced references to other sites');
    return { html: out.trim(), notes };
}
export function plainText(html) {
    return String(html ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&ndash;/g, '-')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
//# sourceMappingURL=content_format.js.map