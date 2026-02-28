/**
 * initDb.ts — Run once to create the database and all tables.
 * Usage:  npm run db:init
 */
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function init() {
  // Connect WITHOUT specifying a database (we create it inside the SQL)
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,           // needed to run the full schema in one shot
  });

  console.log('✅  Connected to MySQL as', process.env.DB_USER);

  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');

  // Strip comments and split on semicolons
  const statements = sql
    .replace(/--.*$/gm, '')             // remove line comments
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await conn.query(stmt);
  }

  console.log('✅  Schema applied — triageflow database is ready.');
  await conn.end();
}

init().catch((err) => {
  console.error('❌  initDb failed:', err.message);
  process.exit(1);
});
