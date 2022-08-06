const firebaseClient = require("firebase")
import { Request, Response } from 'express'
import firebaseAdmin from 'firebase-admin'
import serviceAccount from '../../serviceAccountKey.json'
import { sign } from './auth.interface'
// import * as firebaseConfig from './auth.config'

const credentialObject: object = serviceAccount;
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(credentialObject)
});
const firebaseConfig = {
    apiKey: "AIzaSyDthAM_mdu3_sW6b0rYA4v32SpXxbWfh38",
    authDomain: "exemple-6a0bd.firebaseapp.com",
    projectId: "exemple-6a0bd",
    storageBucket: "exemple-6a0bd.appspot.com",
    messagingSenderId: "1050581757407",
    appId: "1:1050581757407:web:7c880cbd38786b06de686a",
    measurementId: "G-77CNERNHQE"
};

firebaseClient.initializeApp(firebaseConfig);
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
        await firebaseClient.auth().signInWithEmailAndPassword(data.email, data.password)
            .then((authenticatedUser: any) => {
                return firebaseClient.auth().currentUser.getIdToken()
            })
            .then((idToken: any) => {
                res.send({ token: idToken });
            })
    }
    catch (error) {
        return ({ data: error })
    }
}
export const authRepo = {
    create,
    login
}
