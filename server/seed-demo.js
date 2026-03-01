const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function check() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });

  const demoHash = await bcrypt.hash('Demo@1234', 10);
  console.log("Adding Demo account...");
  await conn.query(`
    INSERT IGNORE INTO staff (staff_id, name, role, password_hash)
    VALUES ('DEMO-ADMIN', 'Demo Administrator', 'admin', ?)
  `, [demoHash]);
  
  // also update it just in case it exists with a wrong password
  await conn.query("UPDATE staff SET password_hash = ? WHERE staff_id = 'DEMO-ADMIN'", [demoHash]);
  
  console.log("Demo account created: DEMO-ADMIN / Demo@1234");
  await conn.end();
}
check().catch(console.error);
