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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Genom att skapa ett schema i kod kan vi få lite garantier om datan
// Till skillnad mot sql behöver vi inte uppdatera databasen
const UserSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true, // Varje användare måste ha ett användarnamn
        unique: true, // Varje användarnamn måste vara unikt
        trim: true // Vi vill ta bort alla onödiga mellanslag som kan ha blivit kvar
    },
    password: {
        type: String,
        select: false,
        required: true
    },
}, {
    timestamps: true
});
// Vi skapar ett mongoose middleware som kör innan användare sparas
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Vi kör endast om lösenordet ändrats
        if (!this.isModified('password'))
            return next();
        const passwordHash = yield bcrypt_1.default.hash(this.password, 10);
        this.password = passwordHash;
    });
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
