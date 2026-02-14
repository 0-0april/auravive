<<<<<<< HEAD
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

async function createTestUsers() {
  try {
    console.log('🔧 Creating test users...\n');

    // Hash the password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure userRole column exists
    try {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN userRole ENUM('customer', 'owner') DEFAULT 'customer' AFTER userPass
      `);
      console.log('✅ userRole column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  userRole column already exists');
      } else {
        throw err;
      }
    }

    // Create owner account
    try {
      await pool.query(`
        INSERT INTO users (userFname, userLname, userEmail, userPhone, userUserN, userPass, userRole)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['Shop', 'Owner', 'owner@auravive.com', '+1234567890', 'owner', hashedPassword, 'owner']);
      console.log('✅ Owner account created');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Update existing user to owner role
        await pool.query(`UPDATE users SET userRole = 'owner' WHERE userUserN = 'owner'`);
        console.log('ℹ️  Owner account already exists - updated role');
      } else {
        throw err;
      }
    }

    // Create customer account
    try {
      await pool.query(`
        INSERT INTO users (userFname, userLname, userEmail, userPhone, userUserN, userPass, userRole)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['John', 'Doe', 'customer@auravive.com', '+0987654321', 'customer', hashedPassword, 'customer']);
      console.log('✅ Customer account created');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️  Customer account already exists');
      } else {
        throw err;
      }
    }

    console.log('\n✨ Test users setup complete!\n');
    console.log('📝 Test Credentials:');
    console.log('   Owner    - Username: owner    | Password: password123');
    console.log('   Customer - Username: customer | Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
}

createTestUsers();
=======
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

async function createTestUsers() {
  try {
    console.log('🔧 Creating test users...\n');

    // Hash the password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure userRole column exists
    try {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN userRole ENUM('customer', 'owner') DEFAULT 'customer' AFTER userPass
      `);
      console.log('✅ userRole column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  userRole column already exists');
      } else {
        throw err;
      }
    }

    // Create owner account
    try {
      await pool.query(`
        INSERT INTO users (userFname, userLname, userEmail, userPhone, userUserN, userPass, userRole)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['Shop', 'Owner', 'owner@auravive.com', '+1234567890', 'owner', hashedPassword, 'owner']);
      console.log('✅ Owner account created');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Update existing user to owner role
        await pool.query(`UPDATE users SET userRole = 'owner' WHERE userUserN = 'owner'`);
        console.log('ℹ️  Owner account already exists - updated role');
      } else {
        throw err;
      }
    }

    // Create customer account
    try {
      await pool.query(`
        INSERT INTO users (userFname, userLname, userEmail, userPhone, userUserN, userPass, userRole)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['John', 'Doe', 'customer@auravive.com', '+0987654321', 'customer', hashedPassword, 'customer']);
      console.log('✅ Customer account created');
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️  Customer account already exists');
      } else {
        throw err;
      }
    }

    console.log('\n✨ Test users setup complete!\n');
    console.log('📝 Test Credentials:');
    console.log('   Owner    - Username: owner    | Password: password123');
    console.log('   Customer - Username: customer | Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
}

createTestUsers();
>>>>>>> 98d9533c (Integrated backend database and owner dashboard)
