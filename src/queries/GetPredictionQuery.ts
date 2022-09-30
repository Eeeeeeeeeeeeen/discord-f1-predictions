import { pool } from "../ConnectDb"

export const getPrediction = async (userId: string, serverId: string, sessionId: number) => {
    const result = await pool.query(`SELECT from predictions WHERE (user_id = '${userId}' AND server_id = '${serverId}' AND session_id = '${sessionId}')`)

    return result;
}
