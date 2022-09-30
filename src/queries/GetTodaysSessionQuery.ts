import { QueryResult } from "pg";
import { pool, Session } from "../ConnectDb";

export const getTodaysSession = async (): Promise<QueryResult<Session>> => {
    const results = await pool.query<Session>(`select sessions.id,racename,country,circuit,date,time,season,round,name from sessions LEFT JOIN types ON sessions.type_id = types.id where (DATE(date) = CURRENT_DATE);`)

    return results;
}