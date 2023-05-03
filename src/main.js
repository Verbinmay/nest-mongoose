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
var cookieParser = require("cookie-parser");
var core_1 = require("@nestjs/core");
var app_module_1 = require("./app.module");
var common_1 = require("@nestjs/common");
var exeption_filter_1 = require("./filters/exeption.filter");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule, { abortOnError: false })];
                case 1:
                    app = _a.sent();
                    app.use(cookieParser());
                    /* app.enableCors() позволяет вашему приложению принимать запросы из других доменов, указав набор параметров, которые определяют, какие типы запросов и какие источники будут разрешены.*/
                    app.enableCors();
                    /* app.useGlobalPipes() - это метод из NestJS, который позволяет установить глобальные pipes (каналы) для обработки входящих данных в вашем приложении. Pipes - это объекты, которые позволяют изменять и проверять входящие данные перед тем, как они будут переданы в ваше приложение. */
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        transform: true,
                        whitelist: true,
                        stopAtFirstError: true,
                        exceptionFactory: function (errors) {
                            var errorsForResponse = [];
                            errors.forEach(function (e) {
                                var constraintsKeys = Object.keys(e.constraints);
                                constraintsKeys.forEach(function (ckey) {
                                    errorsForResponse.push({
                                        message: e.constraints[ckey],
                                        field: e.property
                                    });
                                });
                            });
                            throw new common_1.BadRequestException(errorsForResponse);
                        }
                    }));
                    /* app.useGlobalFilters() - это метод из NestJS, который позволяет установить глобальные фильтры для обработки исключений в вашем приложении. Фильтры - это объекты, которые позволяют обрабатывать исключения и изменять ответ, который будет возвращен клиенту при возникновении ошибки.
                  
                  */
                    app.useGlobalFilters(new exeption_filter_1.HttpExceptionFilter());
                    return [4 /*yield*/, app.listen(3000)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();