# Get Started Now - SmartLLM Cloud

## Current Status

✅ **Backend is running** on http://localhost:8000  
✅ **API is responding** with test data  
✅ **Frontend is ready** to connect

## What to Do Right Now

### Step 1: Start the Frontend

Open a **NEW terminal** and run:

```bash
pnpm dev
```

This will start the Next.js frontend on http://localhost:3000

### Step 2: Login

Once the frontend loads at http://localhost:3000:

1. Click **"Login"**
2. Enter:
   - **Email:** `demo@smartllm.ai`
   - **Password:** `demo123`
3. Click **"Sign In"**

### Step 3: Explore

You're now logged in! Explore:
- **Dashboard** - See your AI usage stats
- **Projects** - Manage your AI projects  
- **Playground** - Test AI models
- **Analytics** - View detailed metrics
- **API Keys** - Manage project keys
- **Billing** - See pricing & invoices
- **Settings** - Update your profile

## If You Get "Failed to Fetch" Error

This means the frontend can't reach the backend. Here's how to fix it:

### Check Backend is Running
```bash
curl http://localhost:8000/health
```

Should show: `{"status":"ok","version":"1.0.0"}`

### Check Environment Variable
Make sure `/app/.env.local` contains:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Hard Refresh Browser
Press **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

### See Full Troubleshooting
Read `FIX_FETCH_ERROR.md` for detailed solutions

## What's Running

### Backend Server (Mock API)
- **Location:** `backend/mock_server.py`
- **Port:** 8000
- **URL:** http://localhost:8000
- **Endpoints:** 10+ API endpoints with test data
- **Demo User:** demo@smartllm.ai / demo123

### Frontend
- **Framework:** Next.js 16
- **Port:** 3000
- **URL:** http://localhost:3000

### Database
- **Type:** In-memory (mock server)
- **Data:** Realistic test data included

## Key Endpoints

Once logged in, the frontend will call:

| Endpoint | Purpose |
|----------|---------|
| POST /api/auth/login | Authenticate |
| GET /api/projects | Load projects |
| GET /api/analytics/summary | Load dashboard |
| GET /api/analytics/daily | Load charts |
| GET /api/api-keys | Load API keys |
| GET /api/billing/plan | Load billing |
| GET /api/settings/profile | Load profile |

## API Documentation

To explore all endpoints, visit:
```
http://localhost:8000/docs
```

This opens an interactive Swagger UI where you can test every endpoint.

## Next Steps After Login

1. ✅ Login successful
2. Go to **Dashboard** - should see analytics
3. Go to **Projects** - should see 3 demo projects
4. Go to **API Keys** - should see 2 demo keys
5. Go to **Billing** - should see pricing info
6. Go to **Settings** - should see your profile

## For Full Backend (Optional)

If you want to use the production backend instead of the mock server:

```bash
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

This requires:
- Database setup (SQLite auto-creates on startup)
- All Python dependencies installed
- LLM API keys for AI features (OpenAI, Gemini, Groq)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to Fetch" | See "If You Get Failed to Fetch" above |
| Port 8000 in use | Run: `lsof -ti:8000 \| xargs kill -9` |
| Port 3000 in use | Run: `lsof -ti:3000 \| xargs kill -9` |
| Blank dashboard | Hard refresh: Ctrl+Shift+R |
| Login fails | Use: demo@smartllm.ai / demo123 |
| See errors in console | Open F12 → Console tab |

## Files to Know About

- `app/.env.local` - Frontend environment config
- `backend/mock_server.py` - Backend serving all API calls
- `backend/venv/` - Python virtual environment
- `lib/api-client.ts` - Frontend API client
- `FIX_FETCH_ERROR.md` - Detailed troubleshooting

## You're Ready!

The platform is fully operational:
- ✅ Backend running
- ✅ API responding  
- ✅ Frontend ready
- ✅ Demo data available

**Now run `pnpm dev` in a new terminal and start exploring!**

Questions? Check `FIX_FETCH_ERROR.md` or see http://localhost:8000/docs for API details.
