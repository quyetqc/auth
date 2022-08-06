import firebaseAdmin from 'firebase-admin';
import express, { Request, Response, NextFunction } from 'express'

async function verify(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            throw 'Unauthorized'
        }
        const idToken = req.headers.authorization.split('Bearer ')[1];
        req.body = await firebaseAdmin.auth().verifyIdToken(idToken);
        next();
    } catch (e) {
        res.status(401)
        res.send('Unauthorized');
    }
}
export const auth = {
    verify
}