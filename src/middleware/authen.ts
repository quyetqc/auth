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
            console.log(idToken)
            const secretKey = process.env.SECRETKEY || ''
            const a: any = jwt.verify(idToken, secretKey);

            const queryRole = `select rrp.id_user, rrp.role_name, rrp.permissionId, permission.name as name_permission 
            from (select ur.id_user, ur.role_name, role_permission.permissionId 
            from (select u.id_user, role.name as role_name, role.id as id_role 
            from role inner join (select id as id_user from users) as u
            on u.id_user = role.id_user) as ur 
            inner join role_permission on ur.id_role = role_permission.roleId) as rrp 
            inner join permission on permission.id = rrp.permissionId`;
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
