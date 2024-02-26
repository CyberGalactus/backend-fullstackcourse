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
exports.profile = exports.refreshJWT = exports.logIn = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const assertDefined_1 = require("../util/assertDefined");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (yield User_1.default.findOne({ userName: username })) {
            return res.status(400).json({ message: "Username taken" });
        }
        const user = new User_1.default({ userName: username, password });
        yield user.save();
        res.status(201).json({ username, id: user._id });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.register = register;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_1.default.findOne({ userName: username }, '+password');
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.status(400).json({ message: 'Wrong username or password' });
        }
        (0, assertDefined_1.assertDefined)(process.env.JWT_SECRET);
        // Returnera JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        (0, assertDefined_1.assertDefined)(process.env.REFRESH_TOKEN_SECRET);
        // const secret = process.env.JWT_SECRET;
        // if (!secret) {
        //     throw Error('Missing JWT_SECRET')
        // }
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, refreshToken, username: user.userName });
    }
    catch (error) {
        console.log("Error in login", error);
        res.status(500).json({
            message: "Something blew up"
        });
    }
});
exports.logIn = logIn;
const refreshJWT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
        throw Error('Missing REFRESH_TOKEN_SECRET');
    }
    try {
        const decodedPayload = yield jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret);
        (0, assertDefined_1.assertDefined)(process.env.JWT_SECRET);
        // Returnera JWT
        const token = jsonwebtoken_1.default.sign({ userId: decodedPayload.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'invalid token' });
    }
});
exports.refreshJWT = refreshJWT;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const user = yield User_1.default.findById(userId);
    if (!user) {
        console.log('User not found with id: ', userId);
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
        userName: user.userName
    });
});
exports.profile = profile;
