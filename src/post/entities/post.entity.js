"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PostSchema = exports.Post = exports.extendedLikesInfoSchema = exports.extendedLikesInfo = exports.likeInfoSchema = exports.likeInfo = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var likeInfo = /** @class */ (function () {
    function likeInfo() {
    }
    __decorate([
        (0, mongoose_1.Prop)()
    ], likeInfo.prototype, "addedAt");
    __decorate([
        (0, mongoose_1.Prop)()
    ], likeInfo.prototype, "userId");
    __decorate([
        (0, mongoose_1.Prop)()
    ], likeInfo.prototype, "login");
    likeInfo = __decorate([
        (0, mongoose_1.Schema)()
    ], likeInfo);
    return likeInfo;
}());
exports.likeInfo = likeInfo;
exports.likeInfoSchema = mongoose_1.SchemaFactory.createForClass(likeInfo);
var extendedLikesInfo = /** @class */ (function () {
    function extendedLikesInfo() {
    }
    __decorate([
        (0, mongoose_1.Prop)({ "default": [], type: [exports.likeInfoSchema] })
    ], extendedLikesInfo.prototype, "likesCount");
    __decorate([
        (0, mongoose_1.Prop)({ "default": [], type: [exports.likeInfoSchema] })
    ], extendedLikesInfo.prototype, "dislikesCount");
    __decorate([
        (0, mongoose_1.Prop)({ "default": 'NaN', required: true })
    ], extendedLikesInfo.prototype, "myStatus");
    __decorate([
        (0, mongoose_1.Prop)({ "default": [], type: [exports.likeInfoSchema] })
    ], extendedLikesInfo.prototype, "newestLikes");
    extendedLikesInfo = __decorate([
        (0, mongoose_1.Schema)()
    ], extendedLikesInfo);
    return extendedLikesInfo;
}());
exports.extendedLikesInfo = extendedLikesInfo;
exports.extendedLikesInfoSchema = mongoose_1.SchemaFactory.createForClass(extendedLikesInfo);
var Post = /** @class */ (function () {
    function Post() {
        this._id = new mongoose_2.Types.ObjectId();
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    Post_1 = Post;
    Post.prototype.updateInfo = function (inputModel, blogName) {
        this.title = inputModel.title;
        this.shortDescription = inputModel.shortDescription;
        this.content = inputModel.content;
        this.content = inputModel.content;
        this.blogId = inputModel.blogId;
        this.blogName = blogName;
        this.updatedAt = new Date().toISOString();
        return this;
    };
    Post.prototype.getViewModel = function (userId) {
        var likeArr = this.extendedLikesInfo.likesCount.filter(function (m) { return (m === null || m === void 0 ? void 0 : m.userId) === userId; }).length;
        var dislikeArr = this.extendedLikesInfo.dislikesCount.filter(function (m) { return (m === null || m === void 0 ? void 0 : m.userId) === userId; }).length;
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
            title: this.title,
            shortDescription: this.shortDescription,
            content: this.content,
            blogId: this.blogId,
            blogName: this.blogName,
            createdAt: this.createdAt,
            extendedLikesInfo: {
                likesCount: this.extendedLikesInfo.likesCount.length,
                dislikesCount: this.extendedLikesInfo.dislikesCount.length,
                myStatus: status,
                newestLikes: this.extendedLikesInfo.likesCount.splice(-3).reverse()
            }
        };
        return result;
    };
    Post.createPost = function (blogName, inputModel, blogId) {
        var post = new Post_1();
        post.title = inputModel.title;
        post.shortDescription = inputModel.shortDescription;
        post.content = inputModel.content;
        post.blogName = blogName;
        if ('blogId' in inputModel) {
            post.blogId = inputModel.blogId;
        }
        else {
            post.blogId = blogId;
        }
        return post;
    };
    var Post_1;
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Post.prototype, "title");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Post.prototype, "shortDescription");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Post.prototype, "content");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Post.prototype, "blogId");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Post.prototype, "blogName");
    __decorate([
        (0, mongoose_1.Prop)({ "default": new mongoose_2.Types.ObjectId(), type: mongoose_2["default"].Schema.Types.ObjectId })
    ], Post.prototype, "_id");
    __decorate([
        (0, mongoose_1.Prop)({ "default": new Date().toISOString() })
    ], Post.prototype, "createdAt");
    __decorate([
        (0, mongoose_1.Prop)({ "default": new Date().toISOString() })
    ], Post.prototype, "updatedAt");
    __decorate([
        (0, mongoose_1.Prop)({ "default": {}, type: exports.extendedLikesInfoSchema })
    ], Post.prototype, "extendedLikesInfo");
    Post = Post_1 = __decorate([
        (0, mongoose_1.Schema)()
    ], Post);
    return Post;
}());
exports.Post = Post;
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Post);
exports.PostSchema.methods = {
    updateInfo: Post.prototype.updateInfo,
    getViewModel: Post.prototype.getViewModel
};
exports.PostSchema.statics = {
    createBlog: Post.createPost
};
