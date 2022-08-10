import jwt, { Secret } from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express'
import { DBAPI } from '../../db';
export class AuthorMiddleware extends DBAPI {
    constructor() {
        super();
    }
    async author(req: Request, res: Response, next: NextFunction) {
        try {
            switch(req.path) {
                case "/create":
                  // check quyen
                  break;
                case "/login":
                  // check quyen
                  break;
                default:
                  // code block
              }
            next();
        } catch (e) {
            res.status(401)
            res.send('Unauthorized');
        }
    }
}