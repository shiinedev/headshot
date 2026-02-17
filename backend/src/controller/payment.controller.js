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
exports.getPaymentHistory = exports.handleStripeWebhook = exports.processPayment = exports.getCreditPackages = void 0;
var payment_1 = require("@/services/payment");
var errors_1 = require("@/utils/errors");
var response_1 = require("@/utils/response");
var getCreditPackages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var packages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, payment_1.paymentService.getCreditPackages()];
            case 1:
                packages = _a.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Credit packages retrieved successfully", packages)];
        }
    });
}); };
exports.getCreditPackages = getCreditPackages;
var processPayment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, platform, packageId, phone, successUrl, cancelUrl, paymentResponse;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                if (!userId) {
                    throw new errors_1.ValidationErrors("User not authenticated");
                }
                _a = req.body, platform = _a.platform, packageId = _a.packageId, phone = _a.phone, successUrl = _a.successUrl, cancelUrl = _a.cancelUrl;
                return [4 /*yield*/, payment_1.paymentService.processPayment({
                        userId: userId,
                        platform: platform,
                        packageId: packageId,
                        phone: phone,
                        successUrl: successUrl,
                        cancelUrl: cancelUrl
                    })];
            case 1:
                paymentResponse = _c.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Payment processed successfully", paymentResponse)];
        }
    });
}); };
exports.processPayment = processPayment;
var handleStripeWebhook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stripeSignature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stripeSignature = req.headers["stripe-signature"];
                if (!stripeSignature || typeof stripeSignature !== "string") {
                    throw new errors_1.ValidationErrors("Missing or invalid Stripe signature");
                }
                return [4 /*yield*/, payment_1.stripeService.handleStripeWebhook(req.body, stripeSignature)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.handleStripeWebhook = handleStripeWebhook;
var getPaymentHistory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, limit, history;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    throw new errors_1.ValidationErrors("User not authenticated");
                }
                limit = req.query.limit || "10";
                return [4 /*yield*/, payment_1.paymentService.getPaymentHistory(userId, limit)];
            case 1:
                history = _b.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Payment history retrieved successfully", history)];
        }
    });
}); };
exports.getPaymentHistory = getPaymentHistory;
