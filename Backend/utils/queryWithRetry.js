// utils/queryWithRetry.js
export async function queryWithRetry(pool, sql, params = [], retries = 1) {
  try {
    return await pool.execute(sql, params);
  } catch (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST" && retries > 0) {
      console.warn("⚠️ Connection lost, retrying query once...");
      return queryWithRetry(pool, sql, params, retries - 1);
    }
    throw err;
  }
}