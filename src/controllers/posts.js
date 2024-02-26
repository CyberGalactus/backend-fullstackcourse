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
exports.editPost = exports.deletePost = exports.getPost = exports.getAllPosts = exports.create = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const assertDefined_1 = require("../util/assertDefined");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, assertDefined_1.assertDefined)(req.body.userId);
    const { title, link, body } = req.body;
    const post = new Post_1.default({
        title,
        link,
        body,
        author: req.body.userId
    });
    try {
        const savedPost = yield post.save();
        res.status(201).json(savedPost);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to create post' });
    }
});
exports.create = create;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const limit = parseInt(((_a = req.query.limit) === null || _a === void 0 ? void 0 : _a.toString()) || '5');
    const page = parseInt(((_b = req.query.page) === null || _b === void 0 ? void 0 : _b.toString()) || '1');
    if (isNaN(page) || isNaN(limit)) {
        res.status(400).json({ message: 'Malformed query object number: ' + req.query.toString() });
    }
    const posts = yield Post_1.default
        .find({}, '-comments')
        .sort({ createdAt: 'descending', score: 'descending' })
        .limit(limit)
        .skip(limit * (page - 1))
        .populate("author", "userName");
    const totalCount = yield Post_1.default.countDocuments();
    res.status(200).json({
        posts,
        totalPages: Math.ceil(totalCount / limit),
    });
});
exports.getAllPosts = getAllPosts;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield Post_1.default.findById(id)
        .populate('author', 'userName')
        .populate('comments.author');
    if (!post) {
        return res.status(404).json({ message: 'No post found for id: ' + id });
    }
    res.status(200).json(post);
});
exports.getPost = getPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const { postId } = req.params;
    (0, assertDefined_1.assertDefined)(userId);
    const post = yield Post_1.default.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'No post found for id: ' + userId });
    }
    if (post.author.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    try {
        yield post.deleteOne();
        return res.status(200).json({ message: "Post successfully deleted" });
    }
    catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: "Failed to delete the post" });
    }
});
exports.deletePost = deletePost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, assertDefined_1.assertDefined)(req.body.userId);
    const { title, link, body } = req.body;
    try {
        const post = yield Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'No post found for id: ' });
        }
        if (post.author.toString() !== req.body.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        post.title = title;
        post.link = link;
        post.body = body;
        const updatedPost = yield post.save();
        res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update post" });
    }
});
exports.editPost = editPost;
