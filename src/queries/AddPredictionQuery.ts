import { pool } from "../ConnectDb"

export const addPrediction = async ({ username, first, second, third, serverId, sessionId }: AddPredictionParams) => {
    const query = `INSERT INTO predictions (user_id,first,second,third,server_id,session_id)` +
        `VALUES('${username}', '${first}', '${second}', '${third}', '${serverId}', ${sessionId});`

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