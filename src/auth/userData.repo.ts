import { Request, Response } from 'express'
import { sign } from './auth.interface'
import * as dotenv from 'dotenv'
import { DBAPI } from '../../db'
import bcrypt from 'bcrypt';
import firebaseClient from "firebase"
import firebaseAdmin from 'firebase-admin'
import serviceAccount from '../../serviceAccountKey.json'
import * as config from './auth.config'
import { userInfo } from 'os';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

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
    ): Promise<{ isSuccess: boolean, password: string }> {
        const connection = await this.createConnection()
        try {
            const query = `select email, password from users`;
            const [row]: any = await connection.execute(query)
            const result: any = row;
            for (let i = 0; i < result.length; i++) {
                if (data.email === result[i].email) {
                    return { isSuccess: true, password: row[i].password }
                }
            }
            return { isSuccess: false, password: '' }
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

    async loginFirebase(data: sign, res: Response) {
        try {
            const callFirebase = await firebaseClient.auth().signInWithEmailAndPassword(data.email, data.password)
            const token = await firebaseClient.auth().currentUser!.getIdToken();
            return ({ accesstoken: token });
        }
        catch (error) {
            return ({ data: error })
        }
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
                    await this.createFirebase(data)
                    return { message: 'accout chua duoc verify' }
                }
                return { message: 'Tao user thanh cong, accout duoc verify' }
            }
            return { message: 'Ten dang nhap bi trung, vui long doi ten khac' }
        }
        catch (error) {
            throw (error)
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
                    return { message: 'Dang nhap thanh cong', accesstoken: login.accesstoken }
                }
            }
            return { message: 'user khong ton tai' }
        }
        catch (error) {
            throw (error)
        }
    }
}
