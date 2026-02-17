"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.logout = exports.refreshToken = exports.getCurrentUser = exports.login = exports.resendVerification = exports.verifyEmail = exports.register = void 0;
var config_1 = require("@/config");
var services_1 = require("@/services");
var errors_1 = require("@/utils/errors");
var response_1 = require("@/utils/response");
var cookieOptions = {
    httpOnly: true,
    secure: config_1.config.env === "production",
    sameSite: config_1.config.env === "production" ? "none" : "lax",
    path: "/",
};
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, services_1.authService.registerUser(req.body)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, (0, response_1.createdResponse)(res, "User registered successfully", {
                        user: {
                            id: result.user._id,
                            name: result.user.name,
                            email: result.user.email,
                            isEmailVerified: result.user.isEmailVerified,
                            credits: result.user.credits,
                            createdAt: result.user.createdAt,
                        },
                    })];
        }
    });
}); };
exports.register = register;
var verifyEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (!token || typeof token !== "string") {
                    throw new errors_1.ValidationErrors("Validation Error", [
                        {
                            path: "token",
                            message: "Verification token is required",
                        },
                    ]);
                }
                return [4 /*yield*/, services_1.authService.verifyUserEmail(token)];
            case 1:
                _a.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Email verified successfully")];
        }
    });
}); };
exports.verifyEmail = verifyEmail;
var resendVerification = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                if (!email || typeof email !== "string") {
                    throw new errors_1.ValidationErrors("Validation Error", [
                        {
                            path: "email",
                            message: "Email is required",
                        },
                    ]);
                }
                // service logic will be here
                return [4 /*yield*/, services_1.authService.resendVerificationEmail(email)];
            case 1:
                // service logic will be here
                _a.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Verification email resent successfully")];
        }
    });
}); };
exports.resendVerification = resendVerification;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, _b, user, accessToken, refreshToken;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email ||
                    typeof email !== "string" ||
                    !password ||
                    typeof password !== "string") {
                    throw new errors_1.ValidationErrors("Validation Error", [
                        {
                            path: "email",
                            message: "Email and password are required",
                        },
                    ]);
                }
                return [4 /*yield*/, services_1.authService.loginUser({
                        email: email,
                        password: password,
                    })];
            case 1:
                _b = _c.sent(), user = _b.user, accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                console.log("tokens", { accessToken: accessToken, refreshToken: refreshToken });
                // save cookies or tokens if needed
                res.cookie("accessToken", accessToken, __assign(__assign({}, cookieOptions), { maxAge: 15 * 60 * 1000 }));
                res.cookie("refreshToken", refreshToken, __assign(__assign({}, cookieOptions), { maxAge: 7 * 24 * 60 * 60 * 1000 }));
                return [2 /*return*/, (0, response_1.successResponse)(res, "User logged in successfully", {
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                        },
                    })];
        }
    });
}); };
exports.login = login;
var getCurrentUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new errors_1.ValidationErrors("User ID is required");
                }
                return [4 /*yield*/, services_1.authService.getCurrentUser(userId)];
            case 1:
                user = _b.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Current user fetched successfully", {
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            credits: user.credits,
                            image: user.image,
                            role: user.role,
                            isActive: user.isActive,
                            isEmailVerified: user.isEmailVerified,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                        }
                    })];
        }
    });
}); };
exports.getCurrentUser = getCurrentUser;
var refreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _a, accessToken, refreshToken;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                token = ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken) || ((_c = req.body) === null || _c === void 0 ? void 0 : _c.refreshToken);
                console.log("refresh token:", token);
                if (!token) {
                    throw new errors_1.UnauthorizedError("refresh token is required");
                }
                return [4 /*yield*/, services_1.authService.refreshToken(token)];
            case 1:
                _a = _d.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                res.cookie("accessToken", accessToken, __assign(__assign({}, cookieOptions), { maxAge: 15 * 60 * 1000 }));
                res.cookie("refreshToken", refreshToken, __assign(__assign({}, cookieOptions), { maxAge: 7 * 24 * 60 * 60 * 1000 }));
                return [2 /*return*/, (0, response_1.successResponse)(res, "Token refreshed successfully")];
        }
    });
}); };
exports.refreshToken = refreshToken;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.refreshToken);
                if (!token) {
                    throw new errors_1.UnauthorizedError("refresh token is required");
                }
                if (!token) return [3 /*break*/, 2];
                return [4 /*yield*/, services_1.authService.logoutUser(req.user.userId)];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2:
                res.clearCookie("accessToken", cookieOptions);
                res.clearCookie("refreshToken", cookieOptions);
                return [2 /*return*/, (0, response_1.successResponse)(res, "User logged out successfully")];
        }
    });
}); };
exports.logout = logout;
