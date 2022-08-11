import jwt, { Secret } from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express'
import { DBAPI } from '../../db';
export class AuthorMiddleware extends DBAPI {
  constructor() {
    super();
  }
  async author(req: Request, res: Response, next: NextFunction) {
    try {
      const a = Object.values(req.context)
      let b = 0;
      switch (req.path) {
        case "/create":
          for (let i = 0; i < a.length; i++) {
            if (a[i] === "DELETE") {
              break;
            }
            b = b + 1;
          }
        case "/login":
          // check quyen
          break;
        default:
        // code block
      }
      if (b === a.length) {
        throw "Unauthorized"
      }
      next();
    } catch (e) {
      res.status(401)
      res.send('Unauthorized');
    }
  }
}