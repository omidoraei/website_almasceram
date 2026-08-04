import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read SQL file
const sqlPath = join(__dirname, '../database-schema.sql');
console.log(`📄 Reading schema from: ${sqlPath}`);
const sqlContent = readFileSync(sqlPath, 'utf-8');

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 60).replace(/\n/g, ' ');
      
      try {
        // Execute raw SQL via Supabase RPC or direct query
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // If RPC doesn't exist, try alternative method
          if (error.message.includes('function exec_sql')) {
            console.log(`⚠️  Statement ${i + 1}: Skipped (requires manual execution)`);
            console.log(`   ${preview}...\n`);
          } else {
            throw error;
          }
        } else {
          successCount++;
          console.log(`✅ Statement ${i + 1}: ${preview}...`);
        }
      } catch (err) {
        errorCount++;
        console.log(`❌ Statement ${i + 1} failed: ${err.message}`);
        console.log(`   ${preview}...\n`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Setup Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log('='.repeat(50));
    
    if (errorCount === 0) {
      console.log('\n🎉 Database setup completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('   1. Verify tables in Supabase dashboard');
      console.log('   2. Test API endpoints');
      console.log('   3. Deploy to Vercel');
    } else {
      console.log('\n⚠️  Some statements failed. Please run the SQL manually in Supabase SQL Editor.');
    }
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error('\n💡 Recommendation: Run the SQL file manually in Supabase SQL Editor');
    process.exit(1);
  }
}

setupDatabase();
