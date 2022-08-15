import jwt, { Secret } from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express'
import { DBAPI } from '../../db';
import { messaging } from 'firebase';
export class AuthorMiddleware extends DBAPI {
  constructor() {
    super();
  }
  async author(req: Request, res: Response, next: NextFunction) {
    try {
      const a = Object.values(req.context)
      const namePath = req.path.split(/(\d)/);
      switch (namePath[0]) {
        case "/create":
          if (!a.includes("CREATE")) {
            return res.status(200).send("Nguoi dung khong co quyen tao")
          }
          break;
        case "/update/":
          if (!a.includes("UPDATE")) {
            return res.status(200).send("Nguoi dung khong co quyen sua")
          }
          break;
        case "/":
          if (!a.includes("GET")) {
            return res.status(200).send("Nguoi dung khong co quyen xem")
          }
          break;
        case "/delete/":
          if (!a.includes("DELETE")) {
            return res.status(200).send("Nguoi dung khong co quyen xoa")
          }
        default:
      }
      next();
    } catch (e) {
      res.status(401)
      res.send('Unauthorized');
    }
  }
}