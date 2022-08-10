import { sign } from './auth.interface'
import { userData } from './userData.repo'
import { Request, Response } from 'express'

export class authDatabaseService {
    constructor(private readonly authorized: userData) { }
    async createUser(
        data: sign,
        res: Response,
    ) {
        try {
            const result = await this.authorized.sign(data);
            res.send(result);
        }
        catch (error) {
            throw (error)
        }
    }
    async loginUser(
        data: sign,
        res: Response,
    ) {
        try {
            const result = await this.authorized.login(data, res);
            res.send(result);
        }
        catch (error) {
            throw (error)
        }
    }
    async createAccessTokenByRefresherToken(
        req: Request,
        res: Response,
    ) {
        try {
            const result = await this.authorized.checkRefreshToken(req);
            res.send(result);
        }
        catch (error) {
            throw (error)
        }
    }
}
