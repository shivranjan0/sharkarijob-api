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
export function safeString(value) {
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}
//# sourceMappingURL=query_params.js.map