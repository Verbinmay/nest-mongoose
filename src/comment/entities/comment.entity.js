"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CommentSchema = exports.Comment = exports.commentatorInfoSchema = exports.CommentatorInfo = exports.LikesInfoSchema = exports.LikesInfo = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var LikesInfo = /** @class */ (function () {
    function LikesInfo() {
    }
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], LikesInfo.prototype, "likesCount");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], LikesInfo.prototype, "dislikesCount");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], LikesInfo.prototype, "myStatus");
    LikesInfo = __decorate([
        (0, mongoose_1.Schema)()
    ], LikesInfo);
    return LikesInfo;
}());
exports.LikesInfo = LikesInfo;
exports.LikesInfoSchema = mongoose_1.SchemaFactory.createForClass(LikesInfo);
var CommentatorInfo = /** @class */ (function () {
    function CommentatorInfo() {
    }
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], CommentatorInfo.prototype, "userId");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], CommentatorInfo.prototype, "userLogin");
    CommentatorInfo = __decorate([
        (0, mongoose_1.Schema)()
    ], CommentatorInfo);
    return CommentatorInfo;
}());
exports.CommentatorInfo = CommentatorInfo;
exports.commentatorInfoSchema = mongoose_1.SchemaFactory.createForClass(CommentatorInfo);
var Comment = /** @class */ (function () {
    function Comment() {
        this._id = new mongoose_2.Types.ObjectId();
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    Comment_1 = Comment;
    // updateInfo(inputModel: BlogInputModel) {
    //   this.name = inputModel.name;
    //   this.description = inputModel.description;
    //   this.websiteUrl = inputModel.websiteUrl;
    //   this.updatedAt = new Date().toISOString();
    //   return this;
    // }
    Comment.prototype.getViewModel = function (userId) {
        var likeArr = this.likesInfo.likesCount.indexOf(userId);
        var dislikeArr = this.likesInfo.dislikesCount.indexOf(userId);
        var status = '';
        if (likeArr === dislikeArr) {
            status = 'None';
        }
        else if (likeArr > dislikeArr) {
            status = 'Like';
        }
        else {
            status = 'Dislike';
        }
        var result = {
            id: this._id.toString(),
            content: this.content,
            commentatorInfo: {
                userId: this.commentatorInfo.userId,
                userLogin: this.commentatorInfo.userLogin
            },
            createdAt: this.createdAt,
            likesInfo: {
                likesCount: this.likesInfo.likesCount.length,
                dislikesCount: this.likesInfo.dislikesCount.length,
                myStatus: status
            }
        };
        return result;
    };
    Comment.createComment = function (a) {
        var comment = new Comment_1();
        comment.content = a.content;
        comment.commentatorInfo.userId = a.userId;
        comment.commentatorInfo.userLogin = a.userLogin;
        comment.postId = a.postId;
        return comment;
    };
    var Comment_1;
    __decorate([
        (0, mongoose_1.Prop)({ "default": new mongoose_2.Types.ObjectId(), type: mongoose_2["default"].Schema.Types.ObjectId })
    ], Comment.prototype, "_id");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Comment.prototype, "content");
    __decorate([
        (0, mongoose_1.Prop)({ type: exports.commentatorInfoSchema, required: true })
    ], Comment.prototype, "commentatorInfo");
    __decorate([
        (0, mongoose_1.Prop)({ "default": new Date().toISOString() })
    ], Comment.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)({ "default": new Date().toISOString() })
    ], Comment.prototype, "updatedAt");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Comment.prototype, "postId");
    __decorate([
        (0, mongoose_1.Prop)({ type: exports.LikesInfoSchema, required: true })
    ], Comment.prototype, "likesInfo");
    Comment = Comment_1 = __decorate([
        (0, mongoose_1.Schema)()
    ], Comment);
    return Comment;
}());
exports.Comment = Comment;
exports.CommentSchema = mongoose_1.SchemaFactory.createForClass(CommentatorInfo);
exports.CommentSchema.methods = {
    // updateInfo: Blog.prototype.updateInfo,
    getViewModel: Comment.prototype.getViewModel
};
exports.CommentSchema.statics = {
    createComment: Comment.createComment
};
