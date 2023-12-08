 import User from "../models/User";
 import { Request, Response } from "express";
 import bcrypt from "bcrypt"
 import jwt from 'jsonwebtoken'


 export const register = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    try {
        if( await User.findOne({userName: username})){
            return res.status(400).json({message: "Usename taken"});
        }

        const user = new User({ userName: username, password})
        await user.save()

        res.status(201).json({username, id: user._id});
    } catch (error) {
        res.status(500).send("internal Server Error")
    }

}

export const logIn = async (req: Request, res: Response) => {
    try { 
        // ta in användarnamn och lösen
        const {username, password} = req.body;
        // hitta en användare
        const user = await User.findOne({userName: username});

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'wrong password or password'});
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw Error ('missing JWT_SECRET');
        }
        // JWT
        const token = jwt.sign({ userId: user._id }, secret)

        res.status(200).json({token, username: user.userName})

    } catch (error) {
        res.status(500).json({
            message:""
        })
    }
}