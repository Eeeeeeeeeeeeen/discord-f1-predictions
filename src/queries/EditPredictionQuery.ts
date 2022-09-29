import { pool } from "../ConnectDb"

export const editPrediction = async ({ username, first, second, third, serverId, sessionId }: AddPredictionParams) => {
    const query = `UPDATE predictions SET first = '${first}', second = '${second}', third = '${third}'` +
        `WHERE username = '${username}' AND serverid = '${serverId}' AND sessionid = '${sessionId}';`

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