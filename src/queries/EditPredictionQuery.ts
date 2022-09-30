import { pool } from "../ConnectDb"

export const editPrediction = async ({ username, first, second, third, serverId, sessionId }: AddPredictionParams) => {
    const query = `UPDATE predictions SET first = '${first}', second = '${second}', third = '${third}'` +
        `WHERE user_id = '${username}' AND server_id = '${serverId}' AND session_id = '${sessionId}';`

    await pool.query(query)
}

export interface AddPredictionParams {
    username: string,
    first: string,
    second: string,
    third: string,
    serverId: string,
    sessionId: number
}