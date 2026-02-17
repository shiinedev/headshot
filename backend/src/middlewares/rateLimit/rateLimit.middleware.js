"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = rateLimitMiddleware;
var rateLimit_service_1 = require("@/services/redis/rateLimit.service");
var redis_service_1 = require("@/services/redis/redis.service");
var errors_1 = require("@/utils/errors");
var logger_1 = require("@/utils/logger");
function getIdentifier(req, config) {
    var _a;
    if (config.identifierType === "email") {
        var email = (_a = req.body) === null || _a === void 0 ? void 0 : _a.email;
        if (!email) {
            // fall back to ip
            return getClientIp(req);
        }
        return email.toLowerCase().trim();
    }
    //   default to ip
    return getClientIp(req);
}
function getClientIp(req) {
    var _a;
    var forwarded = req.headers["x-forwarded-for"];
    // "client, proxy1, proxy2"
    if (forwarded) {
        var ips = typeof forwarded === "string" ? forwarded.split(",") : forwarded;
        return ((_a = ips[0]) === null || _a === void 0 ? void 0 : _a.trim()) || "";
    }
    // fallback to remote address
    return (req.headers["x-real-ip"] ||
        req.socket.remoteAddress ||
        "unknown");
}
// format duration in seconds to human readable string
function formatDuration(seconds) {
    if (seconds < 60) {
        return "".concat(seconds, " second").concat(seconds !== 1 ? "s" : "");
    }
    var minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return "".concat(minutes, " minute").concat(minutes !== 1 ? "s" : "");
    }
    var hours = Math.floor(minutes / 60);
    return "".concat(hours, " hour").concat(hours !== 1 ? "s" : "");
}
function rateLimitMiddleware(config) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var identifier, redisKey, _a, allowed, remaining, resetAt, message, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!redis_service_1.redisService.isConnected()) {
                        logger_1.logger.error("Redis is not connected");
                        return [2 /*return*/, next()];
                    }
                    identifier = getIdentifier(req, config);
                    redisKey = "ratelimit:".concat(config.keyPrefix, ":").concat(identifier);
                    return [4 /*yield*/, rateLimit_service_1.rateLimitService.checkRateLimit(redisKey, config.maxRequests, config.windowSeconds)];
                case 1:
                    _a = _b.sent(), allowed = _a.allowed, remaining = _a.remaining, resetAt = _a.resetAt;
                    // set rate limit headers
                    res.setHeader("X-RateLimit-Limit", config.maxRequests);
                    res.setHeader("X-RateLimit-Remaining", remaining);
                    res.setHeader("X-RateLimit-Reset", resetAt.toISOString());
                    if (!allowed) {
                        logger_1.logger.warn("Rate limit exceeded for key: ".concat(redisKey));
                        message = config.message || "Too many requests, please try again later.";
                        throw new errors_1.RateLimitError(message);
                    }
                    next();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    next(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
