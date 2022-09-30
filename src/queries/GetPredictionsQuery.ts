import { pool } from "../ConnectDb"

export const getPredictions = async (sessionId: number) => {
    const result = await pool.query<Prediction>(`SELECT * from predictions WHERE session_id = ${sessionId}`)

    return result;
}

export interface Prediction {
    user_id: string;
    server_id: string;
    session_id: number;
    first: string;
    second: string;
    third: string;
}
