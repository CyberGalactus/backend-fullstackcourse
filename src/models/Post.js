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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
const PostSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        trim: true
    },
    body: {
        type: String,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comments: [CommentSchema],
    upvotes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    downvotes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    score: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
PostSchema.method('upvote', function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userIdObject = new mongoose_1.Types.ObjectId(userId);
        if (this.upvotes.includes(userIdObject)) {
            return;
        }
        else if (this.downvotes.includes(userIdObject)) {
            this.downvotes.pull(userIdObject);
        }
        this.upvotes.push(userIdObject);
    });
});
PostSchema.method('downvote', function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userIdObject = new mongoose_1.Types.ObjectId(userId);
        if (this.downvotes.includes(userIdObject)) {
            return;
        }
        else if (this.upvotes.includes(userIdObject)) {
            this.upvotes.pull(userIdObject);
        }
        this.downvotes.push(userIdObject);
    });
});
PostSchema.pre('save', function (next) {
    if (this.isModified('upvotes') || this.isModified('downvotes')) {
        this.score = this.upvotes.length - this.downvotes.length;
    }
    next();
});
const Post = (0, mongoose_1.model)('Post', PostSchema);
exports.default = Post;
