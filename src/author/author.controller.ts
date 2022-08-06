import { AuthorService } from './author.service'
import express from 'express'
import { auth } from '../auth/auth.middleware'

export class AuthorController {
    constructor(private readonly authorService: AuthorService) { }
    createRouter() {
        const authorRouter = express.Router()
        authorRouter.post('/create', auth.verify, (req, res) => {
            this.authorService.createAuthor(req.body, res);
        })
        authorRouter.put('/update/:id', auth.verify, (req, res) => {
            this.authorService.updateAuthor(+req.params.id, req.body, res);
        })
        authorRouter.delete('/delete/:id', auth.verify, (req, res) => {
            this.authorService.deleteAuthor(+req.params.id, res);
        })
        authorRouter.get('/:id', auth.verify, (req, res) => {
            this.authorService.findOneAuthor(+req.params.id, res);
        })
        authorRouter.get('/', auth.verify, (req, res) => {
            this.authorService.findAllAuthor(res)
        })
        return authorRouter;
    }
}