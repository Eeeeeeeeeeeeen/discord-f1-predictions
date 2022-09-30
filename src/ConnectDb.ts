import { Pool, QueryResult } from "pg";

export const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
});

export const connectDb = async () => {
    try {
        await pool.connect()
        const res = await pool.query('SELECT * FROM prediction')
        console.log(res)
        await pool.end()
    } catch (error) {
        console.log(error)
    }
}

export const getSessions = async (): Promise<QueryResult<Session>> => {
    const results = await pool.query<Session>(`SELECT * FROM sessions`)
    
    return results;
}


export interface Session {
    id: number;
    racename: string;
    country: string;
    circuit: string;
    date: Date;
    time: string;
    season: number;
    round: number;
    name: string;
}