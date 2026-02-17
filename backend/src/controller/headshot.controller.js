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
exports.deleteHeadshot = exports.getHeadshots = exports.generateHeadshot = exports.getAvailableStyles = void 0;
var headshot_1 = require("@/services/headshot");
var response_1 = require("@/utils/response");
var mongoose_1 = require("mongoose");
var errors_1 = require("@/utils/errors");
var getAvailableStyles = function (req, res) {
    // Logic to retrieve available headshot styles
    var styles = headshot_1.headshotService.getAvailableStyles();
    return (0, response_1.successResponse)(res, "Available headshot styles retrieved successfully", styles);
};
exports.getAvailableStyles = getAvailableStyles;
var generateHeadshot = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, file, styles, customPrompt, result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = new mongoose_1.default.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
                file = req.file;
                styles = (req.body.styles || []);
                customPrompt = req.body.prompt;
                console.log("Body:", req.body);
                if (!file) {
                    throw new errors_1.ValidationErrors("No file uploaded");
                }
                if (!styles) {
                    throw new errors_1.ValidationErrors("No styles provided");
                }
                return [4 /*yield*/, headshot_1.headshotService.saveOriginalPhoto({
                        userId: userId,
                        file: file,
                        styles: styles,
                        customPrompt: customPrompt,
                    })];
            case 1:
                result = _b.sent();
                return [2 /*return*/, (0, response_1.createdResponse)(res, "creating headshot Please wait...", result)];
        }
    });
}); };
exports.generateHeadshot = generateHeadshot;
var getHeadshots = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, status, limit, offset, result;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.query, status = _a.status, limit = _a.limit, offset = _a.offset;
                if (!userId) {
                    throw new errors_1.ValidationErrors("User not authenticated");
                }
                return [4 /*yield*/, headshot_1.headshotService.getHeadshots({
                        userId: userId,
                        status: status,
                        limit: limit,
                        offset: offset,
                    })];
            case 1:
                result = _c.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Headshots retrieved successfully", result)];
        }
    });
}); };
exports.getHeadshots = getHeadshots;
var deleteHeadshot = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, id, deletedId;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = new mongoose_1.default.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
                id = req.params.id;
                if (!userId) {
                    throw new errors_1.ValidationErrors("User not authenticated");
                }
                if (!id) {
                    throw new errors_1.ValidationErrors("Headshot id is required");
                }
                return [4 /*yield*/, headshot_1.headshotService.deleteHeadshot({
                        userId: userId,
                        headshotId: id
                    })];
            case 1:
                deletedId = _b.sent();
                return [2 /*return*/, (0, response_1.successResponse)(res, "Headshot deleted successfully", { id: deletedId })];
        }
    });
}); };
exports.deleteHeadshot = deleteHeadshot;
