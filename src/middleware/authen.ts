import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction, } from 'express'
import { DBAPI } from '../../db';

export class Middleware extends DBAPI {
    constructor() {
        super();
    }
    async verify(req: Request, res: Response, next: NextFunction) {
        const connection = await Middleware.createConnection2()
        try {
            if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
                throw 'Unauthorized'
            }
            const idToken = req.headers.authorization.split('Bearer ')[1];
            const secretKey = process.env.SECRETKEY || ''
            const a: any = jwt.verify(idToken, secretKey);

            const queryRole = `select id_user, action_code from per_detail
             inner join (select id_per as id_role, id_user from user_per
             inner join (select id from users) as us
             on user_per.id = us.id and user_per.licensed = 1 and user_per.id_user = ${a.id}) as us_per
             on per_detail.id_per = us_per.id_role`;
            const resultRole: any = await connection.execute(queryRole);
            const NewResultAction = [];
            for (let i = 0; i < resultRole[0].length; i++) {
                const resultAction = resultRole[0][i]['action_code'];
                NewResultAction.push(`${resultAction}`)
            }
            const data: any = Object.values(NewResultAction);
            req.context = data
            next();
        } catch (e) {
            res.status(401)
            res.send('Unauthorized');
        }
    }
}
