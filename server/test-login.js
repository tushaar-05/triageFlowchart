const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function check() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'triageflow'
  });

  const [rows] = await conn.query("SELECT * FROM staff WHERE staff_id = 'TF-ADMIN'");
  if (rows.length === 0) {
    console.log("User TF-ADMIN not found in DB.");
  } else {
    const user = rows[0];
    console.log("User found:", user);
    const match = await bcrypt.compare('Admin@1234', user.password_hash);
    console.log("Password match for Admin@1234?", match);
    
    // Let's create a new hash for Admin@1234 and update it just in case
    const newHash = await bcrypt.hash('Admin@1234', 10);
    console.log("New hash generated:", newHash);
    await conn.query("UPDATE staff SET password_hash = ? WHERE staff_id = 'TF-ADMIN'", [newHash]);
    console.log("Password hash updated in DB to ensure it works.");
  }
  await conn.end();
}
check().catch(console.error);
