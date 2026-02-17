"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimitConfig = void 0;
var rateLimit_middleware_1 = require("../rateLimit.middleware");
exports.apiRateLimitConfig = {
    general: (0, rateLimit_middleware_1.rateLimitMiddleware)({
        maxRequests: 10,
        windowSeconds: 60, // 1 minute
        identifierType: 'ip',
        keyPrefix: 'api:general', // api rate limit:general
    })
};
