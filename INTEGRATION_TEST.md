# SmartLLM Cloud - Integration Test Guide

This guide helps you test the full integration between frontend and backend.

## Prerequisites

- Node.js 18+ installed
- Python 3.9+ installed
- Git installed

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Start Backend

```bash
cd backend

# Create virtual environment (if not done)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**
- API: http://localhost:8000/api
- Docs: http://localhost:8000/docs

### 3. Start Frontend

In a new terminal:

```bash
# Ensure you're in the project root
pnpm dev
```

Frontend will be available at: **http://localhost:3000**

## Testing Checklist

### Authentication Tests

- [ ] **Login Page Loads**: Navigate to http://localhost:3000/login
  - Default credentials: `demo@smartllm.ai` / `demo123`
  
- [ ] **Demo User Login Works**: 
  - Enter demo credentials
  - Click "Sign In"
  - Should redirect to dashboard
  - User name should appear in header

- [ ] **Registration Works**:
  - Go to http://localhost:3000/register
  - Fill in form with new email
  - Submit
  - Should create user and log in automatically

- [ ] **Logout Works**:
  - From dashboard, click user menu
  - Click "Logout"
  - Should redirect to login page

### Dashboard Tests

- [ ] **Dashboard Loads**: After login, dashboard displays
  
- [ ] **Stats Cards Show Data**:
  - Total Requests card shows number
  - Total Tokens shows M value
  - AI Cost shows $amount
  - Money Saved shows $amount
  - Cache Hit Rate shows %
  - Average Latency shows ms
  - Carbon Footprint shows kg

- [ ] **Charts Render**:
  - Daily Requests Chart displays
  - Monthly Cost Chart displays
  - Model Distribution displays
  - Token Usage Chart displays
  - Cost Comparison Chart displays

### Projects Tests

- [ ] **Projects Page Loads**: Click "Projects" in sidebar
  
- [ ] **View Projects**:
  - See list of demo projects
  - E-commerce Platform project visible
  - Content Generation project visible
  - Data Analysis project visible

- [ ] **Create Project**:
  - Click "Create Project"
  - Enter name and description
  - Click "Create"
  - New project appears in list

- [ ] **Edit Project**:
  - Click project
  - Edit name/description
  - Save changes
  - Updates reflected in list

- [ ] **Delete Project**:
  - Click delete icon on project
  - Confirm deletion
  - Project removed from list

### Playground Tests

- [ ] **Playground Loads**: Click "Playground" in sidebar
  
- [ ] **Model Selection Works**:
  - Click model dropdown
  - See available models: GPT-4o, Gemini, Groq, Ollama
  - Select different models

- [ ] **Run Prompt**:
  - Enter a prompt
  - Click "Run"
  - See response with cost/tokens

### Analytics Tests

- [ ] **Analytics Page Loads**: Click "Analytics" in sidebar
  
- [ ] **Metrics Display**:
  - Summary cards show statistics
  - Charts display data

### API Keys Tests

- [ ] **API Keys Page Loads**: Click "API Keys" in sidebar
  
- [ ] **Generate Key**:
  - Click "Generate New Key"
  - Enter name
  - Key generated and displayed
  - Copy button works

- [ ] **Delete Key**:
  - Click delete on key
  - Confirm
  - Key removed from list

### Billing Tests

- [ ] **Billing Page Loads**: Click "Billing" in sidebar
  
- [ ] **Plan Info Shows**:
  - Current plan displays
  - Usage statistics show
  - Invoices list visible

### Settings Tests

- [ ] **Settings Page Loads**: Click "Settings" in sidebar
  
- [ ] **Update Profile**:
  - Edit name
  - Save changes
  - Changes persisted

## Browser Console Checks

Open browser DevTools (F12) and check:

- [ ] No red errors in Console tab
- [ ] Network tab shows API calls succeeding (200 status)
- [ ] No CORS errors

## API Endpoint Tests

Test API endpoints directly using curl or Postman:

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "full_name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@smartllm.ai",
    "password": "demo123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Projects
```bash
curl -X GET http://localhost:8000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Analytics
```bash
curl -X GET "http://localhost:8000/api/analytics/summary?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Check

The backend uses SQLite by default (file: `backend/smartllm.db`).

To inspect the database:

```bash
# Install sqlite3 command-line tool if needed
# Then:
sqlite3 backend/smartllm.db

# Check tables:
.tables

# Query users:
SELECT * FROM users;

# Query projects:
SELECT * FROM projects;

# Exit:
.quit
```

## Common Issues & Fixes

### "Cannot GET /api/..."
- **Issue**: Backend not running
- **Fix**: Start backend with `uvicorn app.main:app --reload`

### "CORS error"
- **Issue**: Frontend trying to call backend with wrong origin
- **Fix**: Ensure NEXT_PUBLIC_API_URL is set correctly in `app/.env.local`

### "Invalid token" / "401 Unauthorized"
- **Issue**: Token not being sent with request
- **Fix**: Check that localStorage has token after login
- **Debug**: Open DevTools → Application → Local Storage

### "Database is locked"
- **Issue**: Multiple processes accessing SQLite
- **Fix**: Close all backends and frontend, delete `backend/smartllm.db`, restart

### "No module named 'aiosqlite'"
- **Issue**: Dependencies not installed
- **Fix**: Run `pip install -r requirements.txt` in backend folder

## Performance Testing

Load the dashboard and monitor:

1. **Network Performance** (DevTools → Network):
   - API calls should respond in < 200ms
   - Payload sizes should be < 50KB

2. **Page Performance** (DevTools → Performance):
   - Dashboard should load in < 2 seconds
   - No jank on interactions

3. **Memory Usage**:
   - Frontend: < 50MB
   - Backend: < 100MB

## Success Criteria

All of the following should be true:

- [ ] Login works with demo credentials
- [ ] Dashboard loads and displays real data from API
- [ ] All pages accessible without errors
- [ ] No console errors or warnings
- [ ] No CORS errors in Network tab
- [ ] API calls complete successfully (200 status)
- [ ] Data persists across page refreshes
- [ ] Logout clears authentication

## Next Steps

If all tests pass:

1. **Test with LLM APIs** (optional):
   - Add OpenAI/Gemini API keys to `backend/.env`
   - Test playground with real AI responses

2. **Deploy**:
   - Frontend to Vercel
   - Backend to AWS ECS or GCP Cloud Run
   - Database to PostgreSQL (Neon)

3. **Monitor**:
   - Set up logging
   - Track performance metrics
   - Monitor API usage

## Support

If you encounter issues:

1. Check logs:
   - Frontend: Browser console (F12)
   - Backend: Terminal output

2. Review documentation:
   - API docs: http://localhost:8000/docs
   - Integration guide: FRONTEND_BACKEND_INTEGRATION.md

3. Verify setup:
   - Ports not in use (8000, 3000)
   - Dependencies installed
   - Environment variables set

Happy testing!
