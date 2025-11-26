#!/usr/bin/env node
/**
 * Local Environment Variables Verification Script
 * 
 * Usage: node verify-env-local.js
 * 
 * This script checks if all required environment variables are set locally
 * Useful before deploying to ensure your .env.local is properly configured
 */

require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

console.log('\n' + colorize('='.repeat(60), 'cyan'));
console.log(colorize('🔍 Environment Variables Verification', 'bright'));
console.log(colorize('='.repeat(60), 'cyan') + '\n');

const checks = [];
let criticalIssues = 0;
let warnings = 0;

function checkVar(name, required = true, minLength = 0, shouldContain = null) {
  const value = process.env[name];
  const isSet = !!value && value !== '';
  const meetsLength = !minLength || (value && value.length >= minLength);
  const containsString = !shouldContain || (value && value.includes(shouldContain));
  const isPlaceholder = value && value.includes('placeholder');
  
  let status = '✅';
  let message = '';
  let level = 'ok';
  
  if (!isSet) {
    if (required) {
      status = '❌';
      message = 'NOT SET (CRITICAL)';
      level = 'critical';
      criticalIssues++;
    } else {
      status = '⚪';
      message = 'Not set (optional)';
      level = 'optional';
    }
  } else if (isPlaceholder) {
    status = '⚠️ ';
    message = 'Using placeholder value (will not work in production)';
    level = 'warning';
    if (required) criticalIssues++;
  } else if (!meetsLength) {
    status = '⚠️ ';
    message = `Too short (needs ${minLength}+ characters, has ${value.length})`;
    level = 'warning';
    if (required) criticalIssues++;
  } else if (shouldContain && !containsString) {
    status = '⚠️ ';
    message = `Should contain "${shouldContain}"`;
    level = 'warning';
    if (required) criticalIssues++;
  } else {
    message = isSet ? 'SET' : '';
    if (value && name.includes('URL')) {
      message += ` (${value})`;
    } else if (value && (name.includes('KEY') || name.includes('SECRET'))) {
      message += ` (${value.substring(0, 20)}...)`;
    }
  }
  
  checks.push({ name, status, message, level, required });
  return { isSet, valid: isSet && meetsLength && containsString && !isPlaceholder };
}

// Critical checks
console.log(colorize('📋 CRITICAL VARIABLES (Required for app to work)\n', 'bright'));

checkVar('NEXT_PUBLIC_SUPABASE_URL', true, 10, 'supabase.co');
checkVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', true, 100);
checkVar('SUPABASE_SERVICE_ROLE_KEY', true, 100);
checkVar('NEXTAUTH_SECRET', true, 32);
checkVar('NEXTAUTH_URL', true, 10, 'http');

// Print critical checks
checks.filter(c => c.required).forEach(check => {
  const color = check.level === 'critical' ? 'red' : 
                check.level === 'warning' ? 'yellow' : 'green';
  console.log(`${check.status} ${colorize(check.name.padEnd(35), color)} ${check.message}`);
});

console.log('\n' + colorize('⚪ OPTIONAL VARIABLES (For additional features)\n', 'bright'));

checkVar('GITHUB_ID', false);
checkVar('GITHUB_SECRET', false);

// Print optional checks
checks.filter(c => !c.required).forEach(check => {
  console.log(`${check.status} ${check.name.padEnd(35)} ${check.message}`);
});

console.log('\n' + colorize('='.repeat(60), 'cyan'));
console.log(colorize('📊 SUMMARY', 'bright'));
console.log(colorize('='.repeat(60), 'cyan') + '\n');

if (criticalIssues === 0) {
  console.log(colorize('✅ SUCCESS: All critical variables are properly configured!', 'green'));
  console.log(colorize('✅ Your app should work correctly locally and in production.', 'green'));
} else {
  console.log(colorize(`❌ FAILED: ${criticalIssues} critical issue(s) found`, 'red'));
  console.log(colorize('❌ Fix these issues before deploying to production.', 'red'));
}

console.log('\n' + colorize('📚 NEXT STEPS:\n', 'bright'));

if (criticalIssues > 0) {
  console.log(colorize('Local Development:', 'yellow'));
  console.log('  1. Create/edit .env.local file in project root');
  console.log('  2. Add the missing variables (see .env.example if available)');
  console.log('  3. Run this script again: node verify-env-local.js\n');
  
  console.log(colorize('Vercel Deployment:', 'yellow'));
  console.log('  1. Go to: https://vercel.com/dashboard');
  console.log('  2. Select your project → Settings → Environment Variables');
  console.log('  3. Add all required variables');
  console.log('  4. Redeploy your application\n');
  
  console.log(colorize('📖 See VERCEL_AUTH_FIX.md for detailed instructions', 'cyan'));
} else {
  console.log(colorize('For Vercel Deployment:', 'green'));
  console.log('  1. Make sure these same variables are set in Vercel');
  console.log('  2. Use: /api/verify-env endpoint after deployment to verify');
  console.log('  3. Visit: https://your-app.vercel.app/api/verify-env\n');
}

console.log('\n');

// Exit with error code if critical issues found
process.exit(criticalIssues > 0 ? 1 : 0);
