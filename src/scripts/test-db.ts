import 'dotenv/config';
import pool, { initDatabase } from '../lib/db';

async function testDatabase() {
  console.log('🔌 Testing database connection...\n');

  try {
    // Test connection
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Database connection successful!');
    console.log(`   Current time: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL version: ${result.rows[0].pg_version.split(',')[0]}\n`);

    // Initialize schema
    console.log('📦 Initializing database schema...');
    await initDatabase();
    console.log('✅ Database schema initialized successfully!\n');

    // Verify table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'links'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Links table exists and is ready to use!\n');
    } else {
      console.log('❌ Links table not found. Something went wrong.\n');
    }

    // Show table structure
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'links'
      ORDER BY ordinal_position;
    `);

    if (columns.rows.length > 0) {
      console.log('📋 Table structure:');
      columns.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
      });
    }

    console.log('\n🎉 Database is ready! You can now start the development server.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error(`   Error: ${error.message}\n`);
    console.error('Please check:');
    console.error('   1. Your DATABASE_URL in .env file is correct');
    console.error('   2. Your Neon database is running');
    console.error('   3. Your connection string includes ?sslmode=require');
    process.exit(1);
  }
}

testDatabase();

