export interface sign {
    email: string,
    password: string,
    emailVerified: boolean,
    address: string,
    phone_number: string,
    disabled: boolean
}
export interface user extends Request {
    user: sign,
}