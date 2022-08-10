import jwt, { Secret } from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express'
import { DBAPI } from '../../db';
export class Middleware extends DBAPI {
    constructor() {
        super();
    }
    async verify(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
                throw 'Unauthorized'
            }
            const idToken = req.headers.authorization.split('Bearer ')[1];
            const secretKey = process.env.SECRETKEY || ''
            const a = jwt.verify(idToken, secretKey);
            next();
        } catch (e) {
            res.status(401)
            res.send('Unauthorized');
        }
    }
}