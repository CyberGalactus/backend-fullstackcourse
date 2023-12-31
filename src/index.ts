import "dotenv/config";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as authController from '../src/controllers/auth';
import * as postsController from '../src/controllers/posts';
import validateToken from "./middleware/validateToken";
import User from "./models/User";

const app = express()

app.use(cors());
app.use(express.json());

app.post('/register', authController.register);
app.post('/login', authController.logIn);
app.post('/token/refresh', authController.refreshJWT);
app.get('/profile', validateToken, authController.profile);

app.post('/posts', validateToken, postsController.create);
app.get('/posts', postsController.getAllPosts);
app.get('/posts/:id', postsController.getPost);

const mongoURL = process.env.DB_URL;

if (!mongoURL) throw Error('Missing db url');

mongoose.connect(mongoURL)
    .then(() => {
        const port = parseInt(process.env.PORT || '3000');
        const admin = User.findOne({userName: 'admin'})
        if (!admin) {
            User.create({
                userName: 'admin',
                password: 'asdasdfsadf'
            })
        }
        app.listen(port, () => {
            console.log('Server listening on port ' + port);
        })
    })