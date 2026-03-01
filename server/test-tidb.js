const mysql = require('mysql2/promise');

async function check() {
  console.log("Checking connection...");
}
check().catch(console.error);
