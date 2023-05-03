"use strict";
exports.__esModule = true;
exports.Tokens = void 0;
var common_1 = require("@nestjs/common");
exports.Tokens = (0, common_1.createParamDecorator)(function (data, context) {
    var request = context.switchToHttp().getRequest();
    return {
        refreshToken: request.cookies.refreshToken,
        accessToken: request.headers.authorization
    };
});
