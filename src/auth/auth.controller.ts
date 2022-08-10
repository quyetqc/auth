import { userData } from './userData.repo'
import { authDatabaseService } from './authDatabase.service'
import express from 'express'

export class AuthenController {
    constructor(private readonly authDatabaseService: authDatabaseService) { }
    createRouter() {
        const AutheriRouter = express.Router();
        AutheriRouter.post('/create', (req, res) => {
            this.authDatabaseService.createUser(req.body, res)
        })
        AutheriRouter.post('/login', (req, res) => {
            this.authDatabaseService.loginUser(req.body, res)
        })
        AutheriRouter.post('/checkrefresh', (req, res) => {
            this.authDatabaseService.createAccessTokenByRefresherToken(req, res)
        })
        return AutheriRouter;
    }
}