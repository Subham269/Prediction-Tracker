import "dotenv/config";
import pg from "pg";

console.log(process.env.DATABASE_URL);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool; 