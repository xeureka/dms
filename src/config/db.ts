import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.NEON_URL!,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function connectDB() {
  try {
    const client = await pool.connect();
    console.log("DB connected successfully ");
    client.release();
  } catch (error) {
    console.log("Databse connection error: ", error);
    process.exit(1);
  }
}
