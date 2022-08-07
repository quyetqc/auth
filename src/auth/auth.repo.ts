import firebaseClient from "firebase"
import { Request, Response } from 'express'
import firebaseAdmin from 'firebase-admin'
import serviceAccount from '../../serviceAccountKey.json'
import { sign } from './auth.interface'
import * as config from './auth.config'
// import * as firebaseConfig from './auth.config'

const credentialObject: object = serviceAccount;
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(credentialObject)
});

firebaseClient.initializeApp(config.authConfig.firebaseConfig);
// app.post('/singup', async (req, res) =>
async function create(data: sign) {
    const userRe = await firebaseAdmin.auth().createUser({
        email: data.email,
        password: data.password,
        emailVerified: false,
        disabled: false
    });
    return (userRe)
}

//app.post('/login', async (req, res) => 
async function login(data: sign, res: Response) {
    try {
        const callFirebase = await firebaseClient.auth().signInWithEmailAndPassword(data.email, data.password)
        const token = await firebaseClient.auth().currentUser!.getIdToken();
        res.send({ token: token });
    }
    catch (error) {
        return ({ data: error })
    }
}
export const authRepo = {
    create,
    login
}
