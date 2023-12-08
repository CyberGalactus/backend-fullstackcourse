import express  from "express";
import "dontenv/config";
import mongoose from "mongoose";
import * as authController from './controllers/auth'

const app = express()

app.use(express.json())

app.post('/register', authController.register)
app.post('/login', authController.logIn)

const mongoURL = process.env.DB_URL;

if (!mongoURL) throw Error ("missing db url");

mongoose.connect(mongoURL)
    .then(() => {
        const port = parseInt(process.env.PORT || '3000' );
        app.listen(port, () => {
            console.log('Server listening on port 3000' + port);
        });
    })