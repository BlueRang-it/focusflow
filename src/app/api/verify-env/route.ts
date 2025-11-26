/**
 * Environment Variables Verification API
 * 
 * Usage: Visit /api/verify-env in your browser
 * This endpoint checks if all required environment variables are properly configured
 * 
 * SECURITY: This should be removed or protected in production!
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    vercelUrl: process.env.VERCEL_URL || 'Not set',
    
    // NextAuth Configuration
    nextauth: {
      secret: {
        set: !!process.env.NEXTAUTH_SECRET,
        length: process.env.NEXTAUTH_SECRET?.length || 0,
        valid: (process.env.NEXTAUTH_SECRET?.length || 0) >= 32,
        preview: process.env.NEXTAUTH_SECRET ? `${process.env.NEXTAUTH_SECRET.substring(0, 8)}...` : 'NOT SET'
      },
      url: {
        set: !!process.env.NEXTAUTH_URL,
        value: process.env.NEXTAUTH_URL || 'NOT SET',
        valid: process.env.NEXTAUTH_URL?.startsWith('http') || false
      }
    },
    
    // Supabase Configuration
    supabase: {
      url: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
        valid: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || false,
        isPlaceholder: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || false
      },
      anonKey: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        valid: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0) > 100,
        isPlaceholder: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder') || false,
        preview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET'
      },
      serviceRoleKey: {
        set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        valid: (process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0) > 100,
        isPlaceholder: process.env.SUPABASE_SERVICE_ROLE_KEY?.includes('placeholder') || false,
        preview: process.env.SUPABASE_SERVICE_ROLE_KEY ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...` : 'NOT SET'
      }
    },
    
    // Optional: GitHub OAuth
    github: {
      id: {
        set: !!process.env.GITHUB_ID,
        value: process.env.GITHUB_ID ? `${process.env.GITHUB_ID.substring(0, 10)}...` : 'NOT SET (optional)'
      },
      secret: {
        set: !!process.env.GITHUB_SECRET,
        preview: process.env.GITHUB_SECRET ? `${process.env.GITHUB_SECRET.substring(0, 10)}...` : 'NOT SET (optional)'
      }
    }
  };

  // Overall status check
  const criticalChecks = [
    checks.nextauth.secret.valid,
    checks.nextauth.url.valid,
    checks.supabase.url.valid && !checks.supabase.url.isPlaceholder,
    checks.supabase.anonKey.valid && !checks.supabase.anonKey.isPlaceholder,
    checks.supabase.serviceRoleKey.valid && !checks.supabase.serviceRoleKey.isPlaceholder
  ];

  const allCriticalPassed = criticalChecks.every(check => check === true);

  const summary = {
    status: allCriticalPassed ? '✅ ALL CRITICAL VARIABLES SET' : '❌ MISSING CRITICAL VARIABLES',
    readyForProduction: allCriticalPassed,
    criticalIssues: [] as string[],
    warnings: [] as string[]
  };

  // Identify issues
  if (!checks.nextauth.secret.valid) {
    summary.criticalIssues.push('NEXTAUTH_SECRET is missing or too short (needs 32+ characters)');
  }
  if (!checks.nextauth.url.valid) {
    summary.criticalIssues.push('NEXTAUTH_URL is missing or invalid (must start with http/https)');
  }
  if (!checks.supabase.url.valid || checks.supabase.url.isPlaceholder) {
    summary.criticalIssues.push('NEXT_PUBLIC_SUPABASE_URL is missing or using placeholder');
  }
  if (!checks.supabase.anonKey.valid || checks.supabase.anonKey.isPlaceholder) {
    summary.criticalIssues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or using placeholder');
  }
  if (!checks.supabase.serviceRoleKey.valid || checks.supabase.serviceRoleKey.isPlaceholder) {
    summary.criticalIssues.push('SUPABASE_SERVICE_ROLE_KEY is missing or using placeholder');
  }

  // Warnings for optional features
  if (!checks.github.id.set || !checks.github.secret.set) {
    summary.warnings.push('GitHub OAuth not configured (optional feature)');
  }

  const response = {
    summary,
    details: checks,
    help: {
      documentation: '/VERCEL_AUTH_FIX.md',
      nextSteps: summary.criticalIssues.length > 0 
        ? 'Add missing environment variables in Vercel Dashboard → Settings → Environment Variables'
        : 'All critical variables are set! Your app should work correctly.'
    }
  };

  return NextResponse.json(response, {
    status: allCriticalPassed ? 200 : 500,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  });
}
