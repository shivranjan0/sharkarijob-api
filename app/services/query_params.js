// Guards for query-string pagination/filter params.
//
// `request.input()` passes whatever the caller sent straight through. A
// malformed value -- `category[]=a` (array), `limit=-1`, `page=0` -- used to
// reach Lucid untouched and blow up with a raw SQL/driver error (HTTP 500),
// leaking schema details to an unauthenticated caller. These helpers clamp
// to something safe before the value gets near a query builder.
// Lucid turns `page` into `OFFSET perPage * (page - 1)`, and paginate()
// always runs its COUNT(*) first. An unbounded page number therefore buys a
// deep-offset scan for the price of one request, so cap it: nothing in this
// dataset is 10k pages deep, and a caller asking for page 9999999999 is not
// reading the site.
const MAX_PAGE = 10_000;
export function safePage(value) {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n) || n <= 0)
        return 1;
    return Math.min(n, MAX_PAGE);
}
export function safeLimit(value, fallback, max) {
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n) || n <= 0)
        return fallback;
    return Math.min(n, max);
}
export function safeInt(value) {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : undefined;
}
// Only a plain, non-empty string is a valid filter value. Anything else
// (an array from `foo[]=a&foo[]=b`, an object from `foo[x]=1`) is treated as
// "not provided" instead of being handed to a `.where()` clause.
export function safeString(value) {
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}
