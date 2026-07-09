# SmartLLM Cloud - Quick Start Guide

Get the entire platform running in minutes!

## 🚀 Start Everything (Fastest Way)

### Option 1: Docker Compose (Recommended)

```bash
# 1. Start all services
docker-compose -f backend/docker-compose.yml up -d

# 2. Start frontend (in another terminal)
cd /path/to/project
pnpm dev

# 3. Access the app
Frontend:  http://localhost:3000
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/docs
Database:  localhost:5432
Cache:     localhost:6379
Ollama:    localhost:11434
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

**Terminal 3 - Database (Optional if not using Docker):**
```bash
# Ensure PostgreSQL and Redis are running
# Or use Docker just for these:
docker run -p 5432:5432 -e POSTGRES_PASSWORD=smartllm postgres:15
docker run -p 6379:6379 redis:7
```

## ✅ Verify Everything Works

### Check Services Running
```bash
# Backend API
curl http://localhost:8000/health
# Should return: {"status":"ok","version":"1.0.0"}

# Frontend
curl http://localhost:3000
# Should return HTML

# Database (if running locally)
psql -h localhost -U smartllm -d smartllm
```

### Test in Browser

1. Open http://localhost:3000
2. You should see the landing page
3. Click "Sign In" - Demo account loads automatically
4. Explore the dashboard
5. Open http://localhost:8000/docs for API documentation

## 🔌 Connect Frontend to Backend

### 1. Update Frontend Config

Create/edit `app/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Test API Connection

Open browser DevTools (F12) and go to Dashboard:
- Check Network tab for API calls to `localhost:8000`
- Check Console for any errors
- Data should load from backend

### 3. Verify Working

- Dashboard loads with real metrics ✅
- Projects list shows data ✅
- Playground calls LLM providers ✅
- Analytics shows real data ✅

## 🔑 Add LLM API Keys

Add your keys to `backend/.env`:

```env
OPENAI_API_KEY=sk_your_key_here
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=gsk_your_groq_key
```

Or use Ollama (local, no key needed):
```bash
docker pull ollama/ollama
docker run -d -p 11434:11434 ollama/ollama
docker exec ollama ollama pull llama2
```

## 📊 Test Key Features

### 1. Playground
```
1. Go to Dashboard → Playground
2. Enter a prompt
3. Select a model (OpenAI, Gemini, Groq, or Ollama)
4. Click "Run"
5. See AI response with token count and cost
```

### 2. Prompt Optimizer
```
1. Go to Dashboard → Prompt Optimizer
2. Enter a prompt
3. Click "Analyze"
4. See quality score and suggestions
5. Click "Optimize" for improved version
```

### 3. Model Router
```
1. Go to Dashboard → Model Router
2. Enter a complex prompt
3. See recommended model with reasoning
4. Compare cost and latency
```

### 4. Analytics
```
1. Go to Dashboard → Analytics
2. Select time period (7, 30, 90 days)
3. See charts for:
   - Daily requests
   - Monthly costs
   - Token usage
   - Model distribution
```

### 5. Projects
```
1. Go to Dashboard → Projects
2. Create new project
3. Copy API key
4. Use API key with /api/prompts/playground endpoint
```

## 🐳 Docker Cheat Sheet

```bash
# View running containers
docker ps

# View logs
docker-compose logs -f api       # Backend
docker-compose logs -f db        # Database

# Stop all services
docker-compose down

# Stop and remove data
docker-compose down -v

# Restart services
docker-compose restart

# Open database shell
docker-compose exec db psql -U smartllm -d smartllm

# Execute command in container
docker-compose exec api python -c "print('test')"
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port
lsof -i :8000  # or :3000, :5432, etc.
kill -9 <PID>

# Or use different port
pnpm dev -p 3001
uvicorn app.main:app --port 8001
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker-compose ps db

# Restart database
docker-compose restart db

# Check connection string in .env
echo $DATABASE_URL
```

### API Keys Not Working
```bash
# Check .env has keys
cat backend/.env

# Restart backend to load new env vars
docker-compose restart api
# Or: stop uvicorn and restart
```

### Frontend Not Loading
```bash
# Check port 3000 is free
lsof -i :3000

# Clear cache and restart
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Can't Reach API from Frontend

Check CORS settings in `backend/.env`:
```env
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
```

Restart backend if changed.

## 📚 Important Files

| File | Purpose |
|------|---------|
| `/backend/README.md` | Backend documentation |
| `/backend/.env.example` | Backend settings template |
| `/backend/docker-compose.yml` | Full stack definition |
| `/FRONTEND_BACKEND_INTEGRATION.md` | Integration guide |
| `/BACKEND_COMPLETE.md` | Backend details |
| `/app/.env.local` | Frontend settings |

## 🌐 API Documentation

### Auto-Generated Docs
```
Swagger UI:  http://localhost:8000/docs
ReDoc:       http://localhost:8000/redoc
```

### Common Endpoints

**Auth**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

**Playground**
```
POST   /api/prompts/playground
POST   /api/prompts/optimize
POST   /api/prompts/route
GET    /api/prompts/models
```

**Projects**
```
GET    /api/projects
POST   /api/projects
```

**Analytics**
```
GET    /api/analytics/summary
GET    /api/analytics/daily
```

Full list in FRONTEND_BACKEND_INTEGRATION.md

## 🚢 Deploy to Production

### Frontend → Vercel
```bash
cd /path/to/project
vercel --prod

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL https://api.smartllm.com
```

### Backend → AWS/GCP

See `backend/README.md` for:
- AWS ECS deployment
- GCP Cloud Run deployment
- Docker image building
- Environment configuration

## 📈 Next Steps

1. ✅ **Everything Running Locally** - Verify all services
2. ✅ **Test All Features** - Try Playground, Optimizer, Router
3. ✅ **Add API Keys** - Configure LLM providers
4. ✅ **Customize Styling** - Update theme/colors if desired
5. ✅ **Add More Features** - Extend with your ideas
6. ✅ **Deploy** - Production setup on cloud platform

## 💡 Tips

- Use `docker-compose up -d` to start services in background
- Check logs with `docker-compose logs -f` (add service name)
- API keys only needed for paid providers (Groq/Ollama are free)
- Dashboard loads with demo data automatically
- Use API docs at `/docs` to test endpoints
- Check browser Network tab to debug API calls

## ❓ Need Help?

1. **Frontend Issues** → Check `DEPLOYMENT.md`
2. **Backend Issues** → Check `backend/README.md`
3. **Integration Issues** → Check `FRONTEND_BACKEND_INTEGRATION.md`
4. **API Issues** → Check `http://localhost:8000/docs`
5. **Database Issues** → Check Docker logs

## 🎉 You're All Set!

Your SmartLLM Cloud instance is now running with:
- ✅ Modern Next.js frontend
- ✅ Production FastAPI backend
- ✅ PostgreSQL database
- ✅ Redis caching
- ✅ Multi-LLM support
- ✅ Analytics engine
- ✅ Full authentication

Start building! 🚀
