import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv'
import * as bodyParser from "body-parser";

import { AuthorController } from './src/author/author.controller'
import { AuthorService } from './src/author/author.service'
import { AuthorRepo } from './src/author/author.repo'

import { AuthenController } from './src/auth/auth.controller'
import { authDatabaseService } from './src/auth/authDatabase.service';
import { userData } from './src/auth/userData.repo'

import { Middleware } from './src/auth/auth.middleware'

dotenv.config();
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3500;

const userDataRepo = new userData();
const userDataService = new authDatabaseService(userDataRepo);

const authorRepo = new AuthorRepo();
const authorService = new AuthorService(authorRepo);
const middleware = new Middleware;

app.use('/auth', new AuthenController(userDataService).createRouter());
app.use('/author', new AuthorController(authorService, middleware).createRouter());

app.listen(port, () => {
    console.log(`Nodejs sever started running on: ${port}`)
})
