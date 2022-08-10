import { Basic, BasicInfo } from '../common/basic.interface'

export interface creatAuthor {
    name_book: string,
    start_year: string,
    by_author: string
}

export interface author extends Basic, BasicInfo { }
