import * as authService from './auth.service'
import express from 'express'

const Router = express.Router()

Router.post('/sign', (req, res) => {
    authService.authService.createUser(req.body, res)
})

Router.post('/login', (req, res) => {
    authService.authService.loginUser(req.body, res)
})

export const constroller = Router;