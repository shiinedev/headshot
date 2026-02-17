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
exports.createManualOrder = exports.getAllOrders = exports.banUser = exports.deleteUser = exports.addUserCredits = exports.updateUserRole = exports.getAllUsers = void 0;
var services_1 = require("@/services");
var errors_1 = require("@/utils/errors");
var logger_1 = require("@/utils/logger");
var response_1 = require("@/utils/response");
var getAllUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, services_1.adminService.getAllUsers()];
            case 1:
                users = _a.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Users fetched successfully", users)];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
var updateUserRole = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, newRole, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.id;
                newRole = req.body.role;
                if (!userId || !newRole) {
                    logger_1.logger.error("User ID and new role are required, Update role aborted.");
                    throw new errors_1.ValidationErrors("User ID and new role are required");
                }
                return [4 /*yield*/, services_1.adminService.updateUserRole(userId, newRole)];
            case 1:
                user = _a.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "User role updated successfully", user)];
        }
    });
}); };
exports.updateUserRole = updateUserRole;
var addUserCredits = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, creditsToAdd, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.id;
                creditsToAdd = req.body.credits;
                if (!userId || !creditsToAdd) {
                    logger_1.logger.error("User ID and credits to add are required, Addition credits aborted.");
                    throw new errors_1.ValidationErrors("User ID and credits to add are required");
                }
                return [4 /*yield*/, services_1.adminService.addUserCredits(userId, creditsToAdd)];
            case 1:
                user = _a.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "User credits added successfully", user)];
        }
    });
}); };
exports.addUserCredits = addUserCredits;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.id;
                console.log("request query id:", req.query);
                if (!userId) {
                    logger_1.logger.error("User ID is required for deletion, Deletion aborted.");
                    throw new errors_1.ValidationErrors("User ID is required");
                }
                return [4 /*yield*/, services_1.adminService.deleteUser(userId)];
            case 1:
                _a.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "User deleted successfully")];
        }
    });
}); };
exports.deleteUser = deleteUser;
var banUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, isBanned, _a, user, bannedStatus;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = req.params.id;
                isBanned = req.body.isBanned;
                console.log("request query id:", req.query);
                if (!userId) {
                    logger_1.logger.error("User ID is required for banning, Ban aborted.");
                    throw new errors_1.ValidationErrors("User ID is required");
                }
                return [4 /*yield*/, services_1.adminService.banUser(userId, isBanned)];
            case 1:
                _a = _b.sent(), user = _a.user, bannedStatus = _a.isBanned;
                return [2 /*return*/, (0, response_1.successResponse)(res, "".concat(bannedStatus ? "User banned successfully" : "User unbanned successfully"), { user: user, bannedStatus: bannedStatus })];
        }
    });
}); };
exports.banUser = banUser;
var getAllOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, status, platform, data;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, status = _a.status, platform = _a.platform;
                return [4 /*yield*/, services_1.adminService.getAllOrders({
                        page: Number(page),
                        limit: Number(limit),
                        status: status,
                        platform: platform,
                    })];
            case 1:
                data = _d.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Orders fetched successfully", data)];
        }
    });
}); };
exports.getAllOrders = getAllOrders;
var createManualOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, packageId, credits, amount, order;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, packageId = _a.packageId, credits = _a.credits, amount = _a.amount;
                return [4 /*yield*/, services_1.adminService.createManualOrder(userId, packageId, credits, amount)];
            case 1:
                order = _b.sent();
                return [2 /*return*/, (0, response_1.createdResponse)(res, "Manual order created successfully", order)];
        }
    });
}); };
exports.createManualOrder = createManualOrder;
