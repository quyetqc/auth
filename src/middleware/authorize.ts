import jwt, { Secret } from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express'
import { DBAPI } from '../../db';
export class AuthorMiddleware extends DBAPI {
  constructor() {
    super();
  }
  async author(req: Request, res: Response, next: NextFunction) {
    try {
      //const a = Object.values(req.context)
      let b = 0;
      console.log(req.path)
      switch (req.path) {
        case "/create":
            res.send('asdfsadf asdf')
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
      res.send('Unauthorized2');
    }
  }
}