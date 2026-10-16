import { plainText } from './content_format.js';
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;
const STOPWORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'in',
    'is', 'it', 'its', 'of', 'on', 'or', 'out', 'the', 'to', 'was', 'with',
]);
const SITE_TERMS = ['sarkari naukri', 'sarkari result', 'government job'];
export function slugify(value) {
    const slug = String(value ?? '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 200);
    return slug || `post-${Date.now()}`;
}
function clip(text, limit) {
    const flat = text.replace(/\s+/g, ' ').trim();
    if (flat.length <= limit)
        return flat;
    return `${flat.slice(0, limit - 1).replace(/\s+\S*$/, '')}…`;
}
export function buildMetaTitle(title, explicit) {
    return clip(explicit || title, TITLE_LIMIT);
}
export function buildMetaDescription(explicit, shortDescription, contentHtml) {
    const source = explicit || shortDescription || plainText(contentHtml ?? '');
    return clip(source, DESCRIPTION_LIMIT);
}
export function buildKeywords(explicit, facts) {
    const candidates = [];
    if (explicit) {
        candidates.push(...(Array.isArray(explicit) ? explicit : explicit.split(',')));
    }
    else {
        if (facts.title)
            candidates.push(clip(facts.title, 45).replace(/…$/, '').trim());
        for (const fact of [facts.organization, facts.category, facts.location]) {
            if (fact)
                candidates.push(fact);
        }
        candidates.push(...SITE_TERMS);
    }
    const seen = new Set();
    const out = [];
    for (const raw of candidates) {
        const token = String(raw).trim().toLowerCase().replace(/\s+/g, ' ');
        if (token.length < 2 || token.length > 60)
            continue;
        if (STOPWORDS.has(token))
            continue;
        if (!/^[a-z0-9][a-z0-9 .&'()/-]*$/.test(token))
            continue;
        if (seen.has(token))
            continue;
        seen.add(token);
        out.push(token);
        if (out.length === 12)
            break;
    }
    return out.join(', ');
}
export function buildSchema(post, siteUrl) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: post.title,
        url: `${siteUrl.replace(/\/+$/, '')}/post/${post.slug}`,
        employmentType: 'FULL_TIME',
        hiringOrganization: {
            '@type': 'Organization',
            name: post.organization || 'Government of India',
        },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: post.location || 'India',
                addressCountry: 'IN',
            },
        },
    };
    if (post.shortDescription)
        schema.description = post.shortDescription;
    if (post.applicationStartDate)
        schema.datePosted = post.applicationStartDate;
    if (post.applicationEndDate)
        schema.validThrough = post.applicationEndDate;
    if (post.totalPosts)
        schema.totalJobOpenings = post.totalPosts;
    return schema;
}
//# sourceMappingURL=seo_fields.js.map