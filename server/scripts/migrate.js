import pool from '../config/db.js';

async function migrate() {
    try {
        console.log('Migrating database...');
        await pool.query('ALTER TABLE users ADD COLUMN userFacebookID VARCHAR(255) UNIQUE AFTER userID');
        console.log('Added userFacebookID column to users table.');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column userFacebookID already exists.');
            process.exit(0);
        }
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
