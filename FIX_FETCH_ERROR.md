# Fixing "Failed to Fetch" Error

## Problem
The frontend is showing "Failed to Fetch" errors when trying to connect to the backend API.

## Solution

The backend server needs to be running before the frontend can communicate with it. Here's how to fix it:

### Option 1: Use Mock Server (Fastest - for testing frontend)

The mock server is a fully functional backend that responds to all API calls with realistic test data.

```bash
# In the project root, start the mock backend
cd backend
/backend/venv/bin/python mock_server.py
```

This will start the API server on `http://localhost:8000` with all required endpoints.

### Option 2: Use Full Backend (For development)

```bash
# Terminal 1 - Start Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Start Frontend  
pnpm dev
```

### Option 3: Use Startup Script

From project root:
```bash
./start.sh
```

This will attempt to start both servers if they're not already running.

## Verify Backend is Running

Check if the backend is responding:
```bash
curl http://localhost:8000/health
```

You should see:
```json
{"status":"ok","version":"1.0.0"}
```

## Common Issues

### Port 8000 Already in Use
```bash
# Find and kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

### "Failed to fetch" in browser console
1. Check browser console (F12) for the exact error
2. Ensure backend is running on http://localhost:8000
3. Check NEXT_PUBLIC_API_URL in `app/.env.local` is set to `http://localhost:8000/api`

### Frontend not finding backend
The frontend environment variable must be set:
```
# app/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## What's Included

### Mock Server (`backend/mock_server.py`)
A lightweight FastAPI server that provides:
- User authentication (demo@smartllm.ai / demo123)
- Project listings
- Analytics data
- API keys management
- Billing information
- Settings endpoints

Perfect for testing the frontend without the full backend setup.

### Full Backend (`backend/app/main.py`)
Complete backend with:
- Database integration
- User management
- Real data persistence
- All enterprise features

Requires database setup and all dependencies installed.

## Testing

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@smartllm.ai","password":"demo123"}'
```

### Test Projects
```bash
curl http://localhost:8000/api/projects \
  -H "Authorization: Bearer mock_jwt_token_here"
```

### API Documentation
Once backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Quick Checklist

- [ ] Backend server is running on port 8000
- [ ] Frontend can see http://localhost:8000/health responding
- [ ] `app/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
- [ ] Frontend is running on http://localhost:3000
- [ ] No browser console errors about CORS
- [ ] Can login with demo@smartllm.ai / demo123

## Still Having Issues?

1. Check server logs for errors
2. Verify no firewall is blocking port 8000
3. Try using the mock server first to isolate frontend issues
4. Check browser Network tab (F12) to see actual HTTP requests/responses

## Next Steps

Once "Failed to Fetch" is resolved:
1. Login with demo@smartllm.ai / demo123
2. Navigate to Dashboard to see data
3. Test other pages and features
4. Add LLM API keys to backend/.env for AI features
