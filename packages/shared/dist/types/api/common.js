export function createApiError(code, message, details) {
    return { error: { code, message, details } };
}
