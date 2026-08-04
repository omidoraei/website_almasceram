import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing environment variables');
  process.exit(1);
}

console.log('🔗 Testing Supabase connection...\n');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    // Test 1: Check if we can connect
    console.log('Test 1: Checking connection...');
    const { data: healthData, error: healthError } = await supabase.from('products').select('count', { count: 'exact', head: true });
    
    if (healthError) {
      if (healthError.message.includes('relation') || healthError.message.includes('does not exist')) {
        console.log('❌ Tables do not exist yet!');
        console.log('💡 Please run the database-schema.sql file in Supabase SQL Editor\n');
      } else {
        console.log(`❌ Connection error: ${healthError.message}\n`);
      }
    } else {
      console.log('✅ Connection successful!\n');
    }
    
    // Test 2: List all tables
    console.log('Test 2: Checking existing tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.log(`⚠️  Cannot list tables: ${tablesError.message}`);
      console.log('💡 This is normal if tables don\'t exist yet\n');
    } else if (tables && tables.length > 0) {
      console.log('✅ Found tables:');
      tables.forEach(t => console.log(`   - ${t.table_name}`));
      console.log('');
    } else {
      console.log('⚠️  No tables found in public schema\n');
    }
    
    // Test 3: Try to get products
    console.log('Test 3: Fetching products...');
    const { data: products, error: productsError } = await supabase.from('products').select('*').limit(5);
    
    if (productsError) {
      console.log(`❌ Products query failed: ${productsError.message}`);
      if (productsError.message.includes('does not exist')) {
        console.log('💡 Run database-schema.sql first!\n');
      }
    } else if (products && products.length > 0) {
      console.log(`✅ Found ${products.length} products:\n`);
      products.forEach(p => {
        console.log(`   - ${p.code}: ${p.title_fa} (${p.size})`);
      });
      console.log('');
    } else {
      console.log('⚠️  No products found (tables may be empty)\n');
    }
    
    console.log('='.repeat(50));
    console.log('📊 Summary:');
    if (!healthError && products && products.length > 0) {
      console.log('✅ Database is properly set up and working!');
    } else if (healthError && healthError.message.includes('does not exist')) {
      console.log('❌ Database tables need to be created');
      console.log('📝 Action: Run database-schema.sql in Supabase SQL Editor');
    } else {
      console.log('⚠️  Database exists but may need data');
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

testConnection();
