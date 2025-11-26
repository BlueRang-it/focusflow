# 🔍 Environment Variables Verification Guide

## Overview

I've created TWO verification tools to help you check if all required environment variables are properly configured:

1. **Local Verification Script** - Check your local `.env.local` file
2. **Remote API Endpoint** - Check your Vercel deployment

---

## 🖥️ Local Verification (Before Deployment)

### Usage:
```bash
npm run verify-env
```

Or directly:
```bash
node verify-env-local.js
```

### What It Checks:
✅ All critical environment variables are set  
✅ Variables meet minimum length requirements  
✅ No placeholder values are being used  
✅ URLs are properly formatted  

### Example Output:
```
============================================================
🔍 Environment Variables Verification
============================================================

📋 CRITICAL VARIABLES (Required for app to work)

✅ NEXT_PUBLIC_SUPABASE_URL          SET (https://khlrmbtalttxuuufucyf.supabase.co)
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY     SET (eyJhbGciOiJIUzI1NiIs...)
✅ SUPABASE_SERVICE_ROLE_KEY         SET (eyJhbGciOiJIUzI1NiIs...)
❌ NEXTAUTH_SECRET                   NOT SET (CRITICAL)
❌ NEXTAUTH_URL                      NOT SET (CRITICAL)

⚪ OPTIONAL VARIABLES (For additional features)

⚪ GITHUB_ID                         Not set (optional)
⚪ GITHUB_SECRET                     Not set (optional)

============================================================
📊 SUMMARY
============================================================

❌ FAILED: 2 critical issue(s) found
❌ Fix these issues before deploying to production.

📚 NEXT STEPS:

Local Development:
  1. Create/edit .env.local file in project root
  2. Add the missing variables (see .env.example if available)
  3. Run this script again: node verify-env-local.js

Vercel Deployment:
  1. Go to: https://vercel.com/dashboard
  2. Select your project → Settings → Environment Variables
  3. Add all required variables
  4. Redeploy your application

📖 See VERCEL_AUTH_FIX.md for detailed instructions
```

---

## 🌐 Remote Verification (After Deployment)

### Usage:
Visit this URL in your browser after deploying:
```
https://your-app-name.vercel.app/api/verify-env
```

### What It Returns:
A JSON response showing:
- ✅ Overall status (ready for production or not)
- 📋 Detailed check for each variable
- ❌ List of critical issues
- ⚠️ Warnings for optional features
- 📚 Help and next steps

### Example Response:
```json
{
  "summary": {
    "status": "❌ MISSING CRITICAL VARIABLES",
    "readyForProduction": false,
    "criticalIssues": [
      "NEXTAUTH_SECRET is missing or too short (needs 32+ characters)",
      "NEXTAUTH_URL is missing or invalid (must start with http/https)"
    ],
    "warnings": [
      "GitHub OAuth not configured (optional feature)"
    ]
  },
  "details": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "environment": "production",
    "vercel": true,
    "nextauth": {
      "secret": {
        "set": false,
        "length": 0,
        "valid": false,
        "preview": "NOT SET"
      },
      "url": {
        "set": false,
        "value": "NOT SET",
        "valid": false
      }
    },
    "supabase": {
      "url": {
        "set": true,
        "value": "https://khlrmbtalttxuuufucyf.supabase.co",
        "valid": true,
        "isPlaceholder": false
      },
      "anonKey": {
        "set": true,
        "length": 221,
        "valid": true,
        "isPlaceholder": false,
        "preview": "eyJhbGciOiJIUzI1NiIs..."
      },
      "serviceRoleKey": {
        "set": true,
        "length": 225,
        "valid": true,
        "isPlaceholder": false,
        "preview": "eyJhbGciOiJIUzI1NiIs..."
      }
    },
    "github": {
      "id": {
        "set": false,
        "value": "NOT SET (optional)"
      },
      "secret": {
        "set": false,
        "preview": "NOT SET (optional)"
      }
    }
  },
  "help": {
    "documentation": "/VERCEL_AUTH_FIX.md",
    "nextSteps": "Add missing environment variables in Vercel Dashboard → Settings → Environment Variables"
  }
}
```

---

## 📋 Required Environment Variables

### Authentication (NextAuth.js)
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXTAUTH_SECRET` | ✅ Yes | Secret for JWT signing (32+ chars) | `wM3qmoGQrZ2exLsysPyuJDOSYQ4SsptZSzWeQgt8PUM=` |
| `NEXTAUTH_URL` | ✅ Yes | Your app's URL | `https://focusflow.vercel.app` |

### Database (Supabase)
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Public anon key | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | Service role key (server-side) | `eyJhbGciOiJIUzI1NiIs...` |

### Optional Features
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GITHUB_ID` | ⚪ Optional | GitHub OAuth client ID | `Iv1.xxxxxxxxxxxxx` |
| `GITHUB_SECRET` | ⚪ Optional | GitHub OAuth secret | `ghp_xxxxxxxxxxxxx` |

---

## 🚀 Quick Setup Workflow

### Step 1: Verify Locally
```bash
# Check your local environment
npm run verify-env

# If issues found, update .env.local
# Then verify again
npm run verify-env
```

### Step 2: Deploy to Vercel
```bash
git add .
git commit -m "Add environment verification tools"
git push origin main
```

### Step 3: Set Variables in Vercel
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all required variables (see table above)
5. Select environments: Production, Preview, Development

### Step 4: Verify Remote
1. Wait for deployment to complete
2. Visit: `https://your-app.vercel.app/api/verify-env`
3. Check the JSON response
4. If issues found, update variables and redeploy

---

## 🔒 Security Note

**IMPORTANT:** The `/api/verify-env` endpoint shows partial information about your environment variables.

For production, you should either:
1. **Remove the endpoint** after verification: `rm src/app/api/verify-env/route.ts`
2. **Protect it with authentication** (add auth check in the route)
3. **Use environment variable to disable it** in production

Example protection:
```typescript
// At the top of src/app/api/verify-env/route.ts
export async function GET() {
  // Disable in production
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_ENV_CHECK) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // ... rest of code
}
```

---

## 🎯 Troubleshooting

### Script Won't Run Locally
```bash
# Make sure dependencies are installed
npm install

# Make sure dotenv is installed
npm install --save-dev dotenv

# Try running directly
node verify-env-local.js
```

### API Endpoint Returns 404
- Make sure you pushed the code to GitHub
- Verify Vercel deployed the latest commit
- Check the file exists at: `src/app/api/verify-env/route.ts`

### Variables Show as "NOT SET" But They Are Set
- Check for typos in variable names
- Ensure no extra spaces in `.env.local`
- Restart your dev server: `npm run dev`
- For Vercel: Redeploy after adding variables

### Variables Valid But App Still Doesn't Work
- Clear browser cache and cookies
- Check for other errors in Vercel logs
- Verify Supabase database schema is deployed
- Test individual API endpoints

---

## 📊 Success Checklist

- [ ] Local verification passes (`npm run verify-env`)
- [ ] Code pushed to GitHub
- [ ] All variables added to Vercel
- [ ] Vercel deployment succeeds
- [ ] Remote verification passes (`/api/verify-env`)
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Dashboard loads correctly

---

## 🆘 Need Help?

If you're still having issues:
1. Run local verification and share output
2. Visit `/api/verify-env` and share response
3. Check Vercel function logs for errors
4. Refer to `VERCEL_AUTH_FIX.md` for detailed auth setup

---

**Generated Secure Secret for NEXTAUTH_SECRET:**
```
wM3qmoGQrZ2exLsysPyuJDOSYQ4SsptZSzWeQgt8PUM=
```
Save this in your `.env.local` and Vercel environment variables!
