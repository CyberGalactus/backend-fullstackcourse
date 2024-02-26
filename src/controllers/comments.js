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
exports.deleteComment = exports.createComment = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const assertDefined_1 = require("../util/assertDefined");
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { userId } = req.body;
    (0, assertDefined_1.assertDefined)(userId);
    const { commentBody } = req.body;
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Not post found for id: ' + postId });
    }
    post.comments.push({
        body: commentBody,
        author: userId
    });
    const savedPost = yield post.save();
    res.status(201).json(savedPost);
});
exports.createComment = createComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, commentId } = req.params;
    const { userId } = req.body;
    (0, assertDefined_1.assertDefined)(userId);
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Not post found for id: ' + postId });
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
        return res.status(404).json({ message: 'Not comment found for id: ' + commentId });
    }
    if (comment.author.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    comment.deleteOne();
    const updatedPost = yield post.save();
    return res.status(200).json(updatedPost);
});
exports.deleteComment = deleteComment;
