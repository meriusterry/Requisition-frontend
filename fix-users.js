// fix-users.js - Run this to fix all users
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixUsers() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'requisition_db'
    });

    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('🔧 Fixing users in database...\n');

    // First, clear existing users (optional - comment out if you want to keep)
    // await connection.execute('DELETE FROM users WHERE email LIKE "%@company.com"');
    
    // Insert/Update users with proper data
    const users = [
        // Admin
        ['admin', 'admin@requisition.com', hashedPassword, 'System', 'Administrator', 'admin', null],
        
        // Managers
        ['john.doe', 'john.doe@company.com', hashedPassword, 'John', 'Doe', 'manager', 1],
        ['jane.smith', 'jane.smith@company.com', hashedPassword, 'Jane', 'Smith', 'manager', 2],
        ['mike.brown', 'mike.brown@company.com', hashedPassword, 'Mike', 'Brown', 'manager', 3],
        ['sarah.johnson', 'sarah.johnson@company.com', hashedPassword, 'Sarah', 'Johnson', 'manager', 4],
        
        // Requisitioners
        ['robert.wilson', 'robert.wilson@company.com', hashedPassword, 'Robert', 'Wilson', 'requisitioner', 1],
        ['maria.martinez', 'maria.martinez@company.com', hashedPassword, 'Maria', 'Martinez', 'requisitioner', 2],
        ['david.lee', 'david.lee@company.com', hashedPassword, 'David', 'Lee', 'requisitioner', 3],
        ['lisa.white', 'lisa.white@company.com', hashedPassword, 'Lisa', 'White', 'requisitioner', 4],
        ['chris.taylor', 'chris.taylor@company.com', hashedPassword, 'Chris', 'Taylor', 'requisitioner', 5],
        ['amy.anderson', 'amy.anderson@company.com', hashedPassword, 'Amy', 'Anderson', 'requisitioner', 6],
        
        // Approvers
        ['paul.thomas', 'paul.thomas@company.com', hashedPassword, 'Paul', 'Thomas', 'approver', 1],
        ['karen.moore', 'karen.moore@company.com', hashedPassword, 'Karen', 'Moore', 'approver', 2],
        ['richard.jackson', 'richard.jackson@company.com', hashedPassword, 'Richard', 'Jackson', 'approver', 3],
        
        // Viewers
        ['nancy.garcia', 'nancy.garcia@company.com', hashedPassword, 'Nancy', 'Garcia', 'viewer', 4],
        ['daniel.martin', 'daniel.martin@company.com', hashedPassword, 'Daniel', 'Martin', 'viewer', 5]
    ];

    for (const user of users) {
        try {
            // Check if user exists
            const [existing] = await connection.execute(
                'SELECT id FROM users WHERE email = ?',
                [user[1]]
            );
            
            if (existing.length === 0) {
                await connection.execute(
                    `INSERT INTO users (username, email, password_hash, first_name, last_name, role, department_id, is_active, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, NOW())`,
                    user
                );
                console.log(`✅ Created: ${user[1]} (${user[5]})`);
            } else {
                await connection.execute(
                    `UPDATE users SET password_hash = ?, first_name = ?, last_name = ?, role = ?, department_id = ?, is_active = TRUE
                     WHERE email = ?`,
                    [user[2], user[3], user[4], user[5], user[6], user[1]]
                );
                console.log(`✅ Updated: ${user[1]} (${user[5]})`);
            }
        } catch (error) {
            console.error(`❌ Failed: ${user[1]}`, error.message);
        }
    }

    // Verify
    const [counts] = await connection.execute(
        'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );
    
    console.log('\n📊 User Summary:');
    counts.forEach(row => {
        console.log(`   ${row.role}: ${row.count} users`);
    });

    // Test a login
    const [testUser] = await connection.execute(
        'SELECT email, password_hash FROM users WHERE email = ?',
        ['admin@requisition.com']
    );
    
    if (testUser.length > 0) {
        const isValid = await bcrypt.compare('Password123!', testUser[0].password_hash);
        console.log(`\n🔐 Admin login test: ${isValid ? '✅ WORKING' : '❌ FAILED'}`);
    }

    await connection.end();
    console.log('\n✅ Database users fixed!');
}

fixUsers().catch(console.error);