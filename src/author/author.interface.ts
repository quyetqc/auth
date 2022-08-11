import { Request } from 'express';
import { Basic, BasicInfo } from '../common/basic.interface'

export interface creatAuthor {
    name_book: string;
    start_year: string;
    by_author: string;
}

// export interface creatAuthorReq extends Request {
//     body: creatAuthor;
// }
