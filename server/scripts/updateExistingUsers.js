<<<<<<< HEAD
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

async function updateExistingUsers() {
  try {
    console.log('🔧 Updating existing users with hashed passwords...\n');

    // Get all users
    const [users] = await pool.query('SELECT userID, userUserN, userPass, userRole FROM users');
    
    console.log(`Found ${users.length} users in database\n`);

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2b$)
      if (user.userPass.startsWith('$2b$')) {
        console.log(`✓ User "${user.userUserN}" already has hashed password`);
        continue;
      }

      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(user.userPass, 10);
      
      // Update the user
      await pool.query(
        'UPDATE users SET userPass = ? WHERE userID = ?',
        [hashedPassword, user.userID]
      );
      
      console.log(`✅ Updated user "${user.userUserN}" (${user.userRole}) - Password hashed`);
    }

    console.log('\n✨ All users updated successfully!\n');
    
    // Display current users
    const [updatedUsers] = await pool.query(
      'SELECT userID, userFname, userLname, userUserN, userRole FROM users ORDER BY userRole, userID'
    );
    
    console.log('📋 Current Users:');
    console.log('─────────────────────────────────────────────────────────');
    updatedUsers.forEach(u => {
      console.log(`${u.userRole.toUpperCase().padEnd(10)} | ${u.userUserN.padEnd(15)} | ${u.userFname} ${u.userLname}`);
    });
    console.log('─────────────────────────────────────────────────────────\n');

    console.log('🔑 Login Credentials (use original passwords):');
    console.log('   Owner:    username: adminuser  | password: admin123');
    console.log('   Customer: username: johndoe    | password: pass123');
    console.log('   Customer: username: janesmith  | password: pass456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating users:', error);
    process.exit(1);
  }
}

updateExistingUsers();
=======
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

async function updateExistingUsers() {
  try {
    console.log('🔧 Updating existing users with hashed passwords...\n');

    // Get all users
    const [users] = await pool.query('SELECT userID, userUserN, userPass, userRole FROM users');
    
    console.log(`Found ${users.length} users in database\n`);

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2b$)
      if (user.userPass.startsWith('$2b$')) {
        console.log(`✓ User "${user.userUserN}" already has hashed password`);
        continue;
      }

      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(user.userPass, 10);
      
      // Update the user
      await pool.query(
        'UPDATE users SET userPass = ? WHERE userID = ?',
        [hashedPassword, user.userID]
      );
      
      console.log(`✅ Updated user "${user.userUserN}" (${user.userRole}) - Password hashed`);
    }

    console.log('\n✨ All users updated successfully!\n');
    
    // Display current users
    const [updatedUsers] = await pool.query(
      'SELECT userID, userFname, userLname, userUserN, userRole FROM users ORDER BY userRole, userID'
    );
    
    console.log('📋 Current Users:');
    console.log('─────────────────────────────────────────────────────────');
    updatedUsers.forEach(u => {
      console.log(`${u.userRole.toUpperCase().padEnd(10)} | ${u.userUserN.padEnd(15)} | ${u.userFname} ${u.userLname}`);
    });
    console.log('─────────────────────────────────────────────────────────\n');

    console.log('🔑 Login Credentials (use original passwords):');
    console.log('   Owner:    username: adminuser  | password: admin123');
    console.log('   Customer: username: johndoe    | password: pass123');
    console.log('   Customer: username: janesmith  | password: pass456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating users:', error);
    process.exit(1);
  }
}

updateExistingUsers();
>>>>>>> 98d9533c (Integrated backend database and owner dashboard)
