const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!connectionString) {
  console.log('No server-side Postgres connection configured; skipping migration.');
  process.exit(0);
}

const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase.sql'), 'utf8');
const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

client.connect()
  .then(() => client.query(sql))
  .then(() => console.log('DOGEBOT PACK Supabase schema is ready.'))
  .catch((error) => {
    console.error(`Supabase schema migration failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => client.end());
