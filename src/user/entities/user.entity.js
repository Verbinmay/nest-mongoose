"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserSchema = exports.User = exports.emailConfirmationSchema = exports.EmailConfirmation = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var EmailConfirmation = /** @class */ (function () {
    function EmailConfirmation() {
        this.isConfirmed = false;
    }
    __decorate([
        (0, mongoose_1.Prop)()
    ], EmailConfirmation.prototype, "confirmationCode");
    __decorate([
        (0, mongoose_1.Prop)()
    ], EmailConfirmation.prototype, "expirationDate");
    __decorate([
        (0, mongoose_1.Prop)({ type: Boolean, "default": false })
    ], EmailConfirmation.prototype, "isConfirmed");
    EmailConfirmation = __decorate([
        (0, mongoose_1.Schema)()
    ], EmailConfirmation);
    return EmailConfirmation;
}());
exports.EmailConfirmation = EmailConfirmation;
exports.emailConfirmationSchema = mongoose_1.SchemaFactory.createForClass(EmailConfirmation);
var User = /** @class */ (function () {
    function User() {
        this._id = new mongoose_2.Types.ObjectId();
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    User_1 = User;
    User.prototype.getViewModel = function () {
        var result = {
            id: this._id.toString(),
            login: this.login,
            email: this.email,
            createdAt: this.createdAt
        };
        return result;
    };
    User.createUser = function (inputModel, confirmationCode, expirationDate, hash) {
        var user = new User_1();
        user.login = inputModel.login;
        user.email = inputModel.email;
        user.hash = hash;
        var emailConfirmation = new EmailConfirmation();
        emailConfirmation.confirmationCode = confirmationCode;
        emailConfirmation.expirationDate = expirationDate;
        user.emailConfirmation = emailConfirmation;
        return user;
    };
    var User_1;
    __decorate([
        (0, mongoose_1.Prop)({ "default": new mongoose_2.Types.ObjectId(), type: mongoose_2["default"].Schema.Types.ObjectId })
    ], User.prototype, "_id");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], User.prototype, "login");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], User.prototype, "email");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], User.prototype, "hash");
    __decorate([
        (0, mongoose_1.Prop)({ "default": new Date().toISOString() })
    ], User.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)({ "default": new Date().toISOString() })
    ], User.prototype, "updatedAt");
    __decorate([
        (0, mongoose_1.Prop)({ type: exports.emailConfirmationSchema, required: true })
    ], User.prototype, "emailConfirmation");
    User = User_1 = __decorate([
        (0, mongoose_1.Schema)()
    ], User);
    return User;
}());
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.methods = {
    getViewModel: User.prototype.getViewModel
};
exports.UserSchema.statics = {
    createUser: User.createUser
};
