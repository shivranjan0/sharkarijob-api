import { defineConfig } from '@adonisjs/core/bodyparser';
// No route in this API accepts a file upload -- nothing calls request.file()
// and there is no disk/storage driver configured. Multipart bodies are
// refused outright by RejectMultipartMiddleware before they are ever read;
// these settings are the backstop if that is removed.
//
// Note: do NOT "harden" this by setting autoProcess to false. The body is
// still spooled to a temp file, but with nothing owning it the file is never
// cleaned up -- which turns a transient 20mb write into a permanent one.
const bodyParserConfig = defineConfig({
    allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
    form: {
        limit: '1mb',
        convertEmptyStringsToNull: true,
        types: ['application/x-www-form-urlencoded'],
    },
    json: {
        limit: '1mb',
        convertEmptyStringsToNull: true,
        types: [
            'application/json',
            'application/json-patch+json',
            'application/vnd.api+json',
            'application/csp-report',
        ],
    },
    multipart: {
        autoProcess: true,
        convertEmptyStringsToNull: true,
        processManually: [],
        limit: '2mb',
        types: ['multipart/form-data'],
    },
});
export default bodyParserConfig;
