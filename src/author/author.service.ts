import { AuthorRepo } from './author.repo';
import { Request, Response } from 'express'
import { creatAuthor } from './author.interface'

export class AuthorService {
    constructor(private readonly authorRepo: AuthorRepo) { }
    async createAuthor(
        data: creatAuthor,
        res: Response,
    ) {
        try {
            const result = await this.authorRepo.create('author', data);
            res.send(result);
        }
        catch (error) {
            throw (error);
        }
    }
    async updateAuthor(
        id: number,
        data: creatAuthor,
        res: Response,
    ) {
        try {
            const result = await this.authorRepo.update('author', data, id);
            res.send(result);
        }
        catch (error) {
            throw (error);
        }
    }
    async deleteAuthor(
        id: number,
        res: Response,
    ) {
        try {
            const result = await this.authorRepo.delete('author', id);
            res.send(result)
        }
        catch (error) {
            throw (error);
        }
    }
    async findOneAuthor(
        id: number,
        res: Response,
    ) {
        try {
            const result = await this.authorRepo.findOne('author', id);
            res.send(result);
        }
        catch (error) {
            throw (error)
        }
    }
    async findAllAuthor(
        res: Response
    ) {
        try {
            const result = await this.authorRepo.findAll('author');
            res.send(result);
        }
        catch (error) {
            throw (error)
        }
    }
}