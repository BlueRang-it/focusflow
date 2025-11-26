// Environment variable checker
require('dotenv').config({ path: '.env.local' });

console.log('\n=== Environment Variable Check ===\n');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

let allSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName.includes('KEY') || varName.includes('SECRET')) {
      console.log(`✅ ${varName}: SET (${value.substring(0, 20)}...)`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allSet = false;
  }
});

console.log('\n=== Optional Variables ===\n');

const optionalVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'GITHUB_ID',
  'GITHUB_SECRET'
];

optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== '') {
    if (varName.includes('KEY') || varName.includes('SECRET')) {
      console.log(`✅ ${varName}: SET (${value.substring(0, 20)}...)`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`⚪ ${varName}: Not set (optional)`);
  }
});

console.log('\n=== Summary ===\n');

if (allSet) {
  console.log('✅ All required environment variables are set!');
  console.log('✅ You can now run: npm run dev');
} else {
  console.log('❌ Some required environment variables are missing!');
  console.log('❌ Please check your .env.local file');
}

console.log('\n');
