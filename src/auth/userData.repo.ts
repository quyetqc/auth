import { Request, Response } from 'express'
import { sign } from './auth.interface'
import * as dotenv from 'dotenv'
import { DBAPI } from '../../db'
import bcrypt from 'bcrypt';
import firebaseClient from "firebase"
import firebaseAdmin from 'firebase-admin'
import serviceAccount from '../../serviceAccountKey.json'
import jwt, { Secret } from 'jsonwebtoken';
import * as config from './auth.config'

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const credentialObject: object = serviceAccount;

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(credentialObject)
});

firebaseClient.initializeApp(config.authConfig.firebaseConfig);


export class userData extends DBAPI {
    async check_user(
        data: sign,
    ): Promise<{ isSuccess: boolean, password: string, id: number | string, email: string }> {
        const connection = await this.createConnection()
        try {
            const query = `select email, password, id from users`;
            const [row]: any = await connection.execute(query)
            const result: any = row;
            for (let i = 0; i < result.length; i++) {
                if (data.email === result[i].email) {
                    return { isSuccess: true, password: row[i].password, email: row[i].email, id: row[i].id }
                }
            }
            return { isSuccess: false, password: '', id: '', email: '' }
        }
        catch (error) {
            throw (error)
        }
    }
    async createFirebase(data: sign) {
        const userRe = await firebaseAdmin.auth().createUser({
            email: data.email,
            password: data.password,
            emailVerified: false,
            disabled: false,
        });
        return (userRe)
    }

    async sign(
        data: sign
    ) {
        const connection = await this.createConnection()
        try {
            const check = await this.check_user(data);
            if (check.isSuccess == false) {
                const hashPassword = bcrypt.hashSync(data.password, saltRounds);
                const query = `insert into users (email, password) values ('${data.email}', '${hashPassword}')`;
                const [row] = await connection.execute(query);
                const firebase = await this.createFirebase(data);
                if (firebase.uid.length == 0) {
                    for (let i = 0; i <= 5; i++) {
                        await this.createFirebase(data)
                        if (firebase.uid.length != 0) {
                            break;
                        }
                        else {
                            return { message: 'accout chua duoc verify, vui long tao lai' }
                        }
                    }
                }
                return { message: 'Tao user thanh cong, accout duoc verify' }
            }
            return { message: 'Ten dang nhap bi trung, vui long doi ten khac' }
        }
        catch (error) {
            throw (error)
        }
    }

    async loginFirebase(data: sign, res: Response) {
        try {
            const callFirebase = await firebaseClient.auth().signInWithEmailAndPassword(data.email, data.password)
            return { message: "dang nhap firebase thanh cong" }
        }
        catch (error) {
            return ({ data: error })
        }
    }

    async login(
        data: sign,
        res: Response
    ) {
        const connection = await this.createConnection()
        try {
            const check = await this.check_user(data);
            const isPasswordValid = bcrypt.compareSync(data.password, check.password);
            if (check.isSuccess == true) {
                if (!isPasswordValid) {
                    return { message: 'Mat khau khong dung' }
                }
                else {
                    const login = await this.loginFirebase(data, res)
                    const payload = {
                        "email": check.email,
                        "id": check.id,
                    }
                    const SECRETKEY = process.env.SECRETKEY || "";
                    const REFRESHKEY = process.env.REFRESHKEY || "";
                    const accessToken = jwt.sign(payload, SECRETKEY, { expiresIn: "900s" })
                    // const refreshToken = jwt.sign(payload, REFRESHKEY, { expiresIn: "28800s" })
                    // const query = `UPDATE users SET refresh_token = '${refreshToken}' WHERE id = ${check.id};`
                    // const [row] = await connection.execute(query)
                    return { message: 'Dang nhap thanh cong', messageFirebase: login.message, accessToken: accessToken}
                }
            }
            return { message: 'user khong ton tai' }
        }
        catch (error) {
            throw (error)
        }
    }

    async checkRefreshToken(
        req: Request,
    ) {
        const connection = await this.createConnection()
        try {
            const refreshToken = req.headers.refreshtoken as string;
            const refreshKey = process.env.REFRESHKEY || ''
            const a: any = jwt.verify(refreshToken, refreshKey);
            const query = `select id, email, refresh_token from users`;
            const [row] = await connection.execute(query);
            const result: any = row;
            const SECRETKEY = process.env.SECRETKEY || '';
            for (let i = 0; i < result.length; i++) {
                if (result[i].refresh_token == refreshToken && a.id == result[i].id) {
                    const data = {
                        "email": result[i].email,
                        "id": result[i].id,
                    }
                    const accessToken = jwt.sign(data, SECRETKEY, { expiresIn: '900s' });
                    return { message: 'refreshtoken hop le', accessToken };
                }
            }
            return { message: 'refreshtoken khong hop le' }
        }
        catch (error) {
            throw (error)
        }
    }
}
