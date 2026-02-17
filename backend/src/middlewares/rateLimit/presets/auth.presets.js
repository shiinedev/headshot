"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimitConfig = void 0;
var rateLimit_middleware_1 = require("../rateLimit.middleware");
exports.authRateLimitConfig = {
    login: (0, rateLimit_middleware_1.rateLimitMiddleware)({
        maxRequests: 5,
        windowSeconds: 60, // 1 minute
        identifierType: 'email',
        keyPrefix: 'auth:login', // auth rate limit:login
    }),
    register: (0, rateLimit_middleware_1.rateLimitMiddleware)({
        maxRequests: 5,
        windowSeconds: 60,
        identifierType: 'email',
        keyPrefix: 'auth:register',
    }),
};
