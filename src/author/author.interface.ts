import { Basic, BasicInfo } from '../common/basic.interface'

export interface creatAuthor {
    ID: number,
    name: string,
}

export interface author extends Basic, BasicInfo { }
