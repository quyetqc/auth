import mysql from 'mysql2/promise';

// create the connection to database
export class DBAPI {
    async createConnection() {
        const connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PWD,
            database: process.env.DATABASE,
        });
        return connection;
    }

    async create<T>(table: string, data: T) {
        try {
            const connection = await this.createConnection();
            const listcolumn = Object.keys(data).toString();
            const listvalues = Object.values(data).map((e) => `'${e}'`);
            const query = `insert into ${table}(${listcolumn}) values(${listvalues})`;
            const [row] = await connection.execute(query);
            return { success: true };
        }
        catch (error) {
            throw (error);
        }
    }
    async update<T>(table: string, data: T, id: number) {
        try {
            const connection = await this.createConnection();
            let stringKeyValues = '';
            for (const [key, values] of Object.entries(data)) {
                stringKeyValues = stringKeyValues + `${key}='${values}',`;
            }
            const newStringKeyValues = stringKeyValues.slice(0, -1);
            const query = `update ${table} set ${newStringKeyValues} where id = ${id}`
            const [row] = await connection.execute(query);
            return { success: true };
        }
        catch (error) {
            throw (error)
        }
    }
    async delete(table: string, id: number) {
        try {
            const connection = await this.createConnection();
            const query = `delete from ${table} where id = ${id}`
            const [row] = await connection.execute(query);
            return { success: true };
        }
        catch (error) {
            throw (error)
        }
    }
    async findOne(table: string, id: number) {
        try {
            const connection = await this.createConnection();
            const query = `select * from ${table} where id = ${id}`;
            const [row] = await connection.execute(query);
            return row;
        }
        catch (error) {
            throw (error)
        }
    }
    async findAll(table: string) {
        try {
            const connection = await this.createConnection();
            const query = `select * from ${table}`;
            const [row] = await connection.execute(query);
            return row;
        }
        catch (error) {
            throw (error)
        }
    }
}
