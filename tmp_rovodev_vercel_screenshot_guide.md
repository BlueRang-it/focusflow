# 📸 Visual Guide: Adding Environment Variables to Vercel

## Where to Find Everything

### 1. Finding Your Vercel URL
```
Vercel Dashboard
  └── Your Project (FocusFlow)
      └── Deployments (tab at top)
          └── Latest deployment row
              └── Domain column: https://your-app.vercel.app
```

### 2. Adding Environment Variables
```
Vercel Dashboard
  └── Your Project (FocusFlow)
      └── Settings (tab at top)
          └── Environment Variables (left sidebar)
              └── "Add New" button (top right)
```

### 3. Fill in the Form
For each variable:
```
┌─────────────────────────────────────────────┐
│ Key: NEXTAUTH_SECRET                        │
├─────────────────────────────────────────────┤
│ Value: wM3qmoGQrZ2exLsysPyuJDOSYQ4SsptZ... │
├─────────────────────────────────────────────┤
│ Environments:                               │
│ ☑ Production                                │
│ ☑ Preview                                   │
│ ☑ Development                               │
├─────────────────────────────────────────────┤
│              [Save] button                  │
└─────────────────────────────────────────────┘
```

## Copy-Paste Values (In Order)

### Variable 1:
```
Key: NEXTAUTH_SECRET
Value: wM3qmoGQrZ2exLsysPyuJDOSYQ4SsptZSzWeQgt8PUM=
Environments: All three ✅
```

### Variable 2:
```
Key: NEXTAUTH_URL
Value: https://YOUR-VERCEL-URL.vercel.app
Environments: Production only ✅
```
⚠️ Replace `YOUR-VERCEL-URL` with your actual URL from Deployments tab

### Variable 3:
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://khlrmbtalttxuuufucyf.supabase.co
Environments: All three ✅
```

### Variable 4:
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobHJtYnRhbHR0eHV1dWZ1Y3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMjk1NzksImV4cCI6MjA3OTYwNTU3OX0.gBBd_DSgOcwdwF9OkHbxJHYSzThGiM5XHnDCPELDlco
Environments: All three ✅
```

### Variable 5:
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobHJtYnRhbHR0eHV1dWZ1Y3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDAyOTU3OSwiZXhwIjoyMDc5NjA1NTc5fQ.iJe0Nso6Hk9u6js6B4CgX7P1rU-fAEM2pVA1uUPBdYg
Environments: All three ✅
```

## After Adding All Variables

You should see a list like this in Vercel:

```
Environment Variables
────────────────────────────────────────
✅ NEXTAUTH_SECRET                  Production, Preview, Development
✅ NEXTAUTH_URL                     Production
✅ NEXT_PUBLIC_SUPABASE_URL         Production, Preview, Development
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY    Production, Preview, Development
✅ SUPABASE_SERVICE_ROLE_KEY        Production, Preview, Development
────────────────────────────────────────
```

**Total: 5 variables**

Then: Wait for deployment or click Redeploy!
