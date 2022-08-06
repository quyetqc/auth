export interface sign {
    email: string,
    password: string,
    emailVerified: boolean,
    disabled: boolean
}
export interface user extends Request {
    user: sign,
}