"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.__esModule = true;
exports.JWTService = void 0;
var common_1 = require("@nestjs/common");
var JWTService = /** @class */ (function () {
    function JWTService(jwt, sessionRepository) {
        this.jwt = jwt;
        this.sessionRepository = sessionRepository;
    }
    JWTService.prototype.createJWTAccessToken = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.jwt.sign({ sub: id }, { secret: process.env.JWT_SECRET, expiresIn: '600s' })];
            });
        });
    };
    JWTService.prototype.createJWTRefreshToken = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.jwt.sign({ deviceId: a.deviceId, sub: a.sub }, { secret: process.env.JWT_SECRET, expiresIn: '500000s' })];
            });
        });
    };
    JWTService.prototype.tokenCreator = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAccess, tokenRefresh;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createJWTAccessToken(a.sub)];
                    case 1:
                        tokenAccess = _a.sent();
                        return [4 /*yield*/, this.createJWTRefreshToken({
                                deviceId: a.deviceId,
                                sub: a.sub
                            })];
                    case 2:
                        tokenRefresh = _a.sent();
                        return [2 /*return*/, {
                                accessToken: { accessToken: tokenAccess },
                                refreshToken: tokenRefresh
                            }];
                }
            });
        });
    };
    JWTService.prototype.verifyToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var result, session, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.jwt.verify(token, {
                                secret: process.env.JWT_SECRET
                            })];
                    case 1:
                        result = _b.sent();
                        if (typeof result === 'string')
                            return [2 /*return*/, null];
                        if (!result.deviceId)
                            return [2 /*return*/, result];
                        return [4 /*yield*/, this.sessionRepository.checkRefreshTokenEqual({
                                iat: result.iat,
                                deviceId: result.deviceId,
                                userId: result.sub
                            })];
                    case 2:
                        session = _b.sent();
                        return [2 /*return*/, session ? result : null];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    JWTService.prototype.decoderJWTs = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var a;
            return __generator(this, function (_a) {
                a = this.jwt.decode(token);
                return [2 /*return*/, a];
            });
        });
    };
    JWTService.prototype.getUserIdFromAccessToken = function (headersAuthorization) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, token, verify;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = '';
                        if (!headersAuthorization) return [3 /*break*/, 2];
                        token = headersAuthorization.split(' ')[1];
                        return [4 /*yield*/, this.verifyToken(token)];
                    case 1:
                        verify = _a.sent();
                        if (verify) {
                            userId = verify.sub;
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, userId];
                }
            });
        });
    };
    JWTService = __decorate([
        (0, common_1.Injectable)()
    ], JWTService);
    return JWTService;
}());
exports.JWTService = JWTService;
