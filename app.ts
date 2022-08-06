import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv'
import * as bodyParser from "body-parser";

import { AuthorController } from './src/author/author.controller'
import { AuthorService } from './src/author/author.service'
import { AuthorRepo } from './src/author/author.repo'

import * as Router from './src/auth/auth.controller'


dotenv.config();
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3500;

const authorRepo = new AuthorRepo();
const authorService = new AuthorService(authorRepo);

app.use('/auth', Router.constroller);
app.use('/author', new AuthorController(authorService).createRouter());

app.listen(port, () => {
    console.log(`Nodejs sever started running on: ${port}`)
})
