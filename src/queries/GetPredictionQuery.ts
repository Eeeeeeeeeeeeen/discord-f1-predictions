import { pool } from "../ConnectDb"

export const getPrediction = async (userId: string, serverId: string, sessionId: number) => {
    const result = await pool.query(`SELECT from predictions WHERE (username = '${userId}' AND serverId = '${serverId}' AND sessionId = '${sessionId}')`)

    return result;
}

export interface AddPredictionParams {
    username: string,
    first: string,
    second: string,
    third: string,
    serverId: string,
    sessionId: number
}