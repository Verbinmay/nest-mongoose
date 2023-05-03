"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PaginationQuery = exports.BasicPagination = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var BasicPagination = /** @class */ (function () {
    function BasicPagination() {
        this.pageNumber = 1;
        this.pageSize = 10;
        this.sortBy = 'createdAt';
        this.sortDirection = 'desc';
    }
    BasicPagination.prototype.skip = function () {
        return (this.pageNumber - 1) * this.pageSize;
    };
    BasicPagination.prototype.sortFilter = function () {
        var _a;
        return _a = {}, _a[this.sortBy] = this.sortDirection === 'desc' ? -1 : 1, _a;
    };
    BasicPagination.prototype.countPages = function (totalCount) {
        return Math.ceil(totalCount / this.pageSize);
    };
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Transform)(function (_a) {
            var value = _a.value;
            return parseInt(value);
        })
    ], BasicPagination.prototype, "pageNumber");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_transformer_1.Transform)(function (_a) {
            var value = _a.value;
            return parseInt(value);
        })
    ], BasicPagination.prototype, "pageSize");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)()
    ], BasicPagination.prototype, "sortBy");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)()
    ], BasicPagination.prototype, "sortDirection");
    return BasicPagination;
}());
exports.BasicPagination = BasicPagination;
var PaginationQuery = /** @class */ (function (_super) {
    __extends(PaginationQuery, _super);
    function PaginationQuery() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.searchNameTerm = '';
        _this.searchLoginTerm = '';
        _this.searchEmailTerm = '';
        return _this;
    }
    PaginationQuery.prototype.createFilterName = function () {
        return { name: { $regex: '(?i)' + this.searchNameTerm + '(?-i)' } };
    };
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)()
    ], PaginationQuery.prototype, "searchNameTerm");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)()
    ], PaginationQuery.prototype, "searchLoginTerm");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)()
    ], PaginationQuery.prototype, "searchEmailTerm");
    return PaginationQuery;
}(BasicPagination));
exports.PaginationQuery = PaginationQuery;
