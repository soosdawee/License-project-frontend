import { defineConfig } from "cypress";
import pg from "pg";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:50760",
    setupNodeEvents(on) {
      // implement node event listeners here
      on("task", {
        async READTOKENFROMDB({ dbConfig, email }) {
          const client = new pg.Pool(dbConfig);
          try {
            const sql =
              "SELECT reset_password_token FROM users WHERE email = $1";
            const result = await client.query(sql, [email]);
            await client.end();
            return result.rows[0]?.reset_password_token || null;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
      });
    },
    // MODIFY ENV DB DETAILS TO MATCH YOUR OWN WHEN TESTING
    env: {
      DB: {
        user: "postgres",
        host: "localhost",
        database: "lic",
        password: "postgres",
        port: 5433,
      },
    },
  },
});
