import { sign } from './auth.interface'
import * as authRepo from './auth.repo'
import { Request, Response } from 'express'


async function createUser(
    data: sign,
    res: Response,
) {
    try {
        const result = await authRepo.authRepo.create(data);
        console.log(result)
        res.send(result);
    }
    catch (error) {
        throw (error)
    }
}
async function loginUser(
    data: sign,
    res: Response,
) {
    try {
        const result = await authRepo.authRepo.login(data, res);
        res.send(result);
    }
    catch (error) {
        throw (error)
    }
}

export const authService = {
    createUser,
    loginUser
}
