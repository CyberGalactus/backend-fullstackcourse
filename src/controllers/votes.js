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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downvote = exports.upvote = void 0;
const assertDefined_1 = require("../util/assertDefined");
const Post_1 = __importDefault(require("../models/Post"));
const upvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { userId } = req.body;
    (0, assertDefined_1.assertDefined)(userId);
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found with ID:' + postId });
    }
    post.upvote(userId);
    const upvotedPost = yield post.save();
    return res.status(200).json(upvotedPost);
});
exports.upvote = upvote;
const downvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { userId } = req.body;
    (0, assertDefined_1.assertDefined)(userId);
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found with ID:' + postId });
    }
    post.downvote(userId);
    const downvotedPost = yield post.save();
    return res.status(200).json(downvotedPost);
});
exports.downvote = downvote;
