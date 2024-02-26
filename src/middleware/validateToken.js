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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw Error('Missing JWT_SECRET');
    }
    jsonwebtoken_1.default.verify(token, secret, (error, decodedPayload) => __awaiter(void 0, void 0, void 0, function* () {
        if (error || !decodedPayload || typeof decodedPayload === 'string') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (!(yield User_1.default.exists({ _id: decodedPayload.userId }))) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        req.body.userId = decodedPayload.userId;
        next();
    }));
};
exports.default = validateToken;
