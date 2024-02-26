"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const authController = __importStar(require("./controllers/auth"));
const postsController = __importStar(require("./controllers/posts"));
const commentsController = __importStar(require("./controllers/comments"));
const votesController = __importStar(require("./controllers/votes"));
const validateToken_1 = __importDefault(require("./middleware/validateToken"));
// import multer from "multer";
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/register', authController.register);
app.post('/login', authController.logIn);
app.post('/token/refresh', authController.refreshJWT);
app.get('/profile', validateToken_1.default, authController.profile);
app.post('/posts', validateToken_1.default, postsController.create);
app.get('/posts', postsController.getAllPosts);
app.get('/posts/:id', postsController.getPost);
app.delete('/posts/:id', validateToken_1.default, postsController.deletePost);
app.put('/posts/:id/edit', validateToken_1.default, postsController.editPost);
app.post('/posts/:postId/upvote', validateToken_1.default, votesController.upvote);
app.post('/posts/:postId/downvote', validateToken_1.default, votesController.downvote);
app.post('/posts/:postId/comments', validateToken_1.default, commentsController.createComment);
app.delete('/posts/:postId/comments/:commentId', validateToken_1.default, commentsController.deleteComment);
const mongoURL = process.env.DB_URL;
if (!mongoURL)
    throw Error('Missing db url');
mongoose_1.default.connect(mongoURL)
    .then(() => {
    const port = parseInt(process.env.PORT || '3000');
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
});
