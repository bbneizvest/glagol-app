import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://api_user:api_user@localhost:5432/glagol",
});

export default pool;
