# SmartLLM Cloud - FastAPI Backend

Production-ready FastAPI backend for the SmartLLM Cloud AI cost optimization platform.

## Features

- **FastAPI** - Modern async Python web framework
- **PostgreSQL** - Production database with Neon support
- **Redis** - Caching and session management
- **JWT Authentication** - Secure token-based auth
- **Multi-LLM Support** - OpenAI, Gemini, Groq, Ollama
- **Async/Await** - Non-blocking I/O for high concurrency
- **Docker** - Complete containerization setup
- **AWS/GCP Ready** - Deploy to cloud platforms

## Quick Start

### Local Development

1. **Clone and setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your API keys and settings
```

3. **Start with Docker Compose:**
```bash
docker-compose up -d
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

4. **Or start locally:**
```bash
# Make sure PostgreSQL and Redis are running
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Manual Database Setup

```bash
# Create database
createdb smartllm

# Run migrations (if using Alembic)
alembic upgrade head
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Prompts & Playground
- `POST /api/prompts/playground` - Run playground
- `POST /api/prompts/optimize` - Optimize prompt
- `POST /api/prompts/route` - Get model recommendation
- `GET /api/prompts/models` - List models

### Analytics
- `GET /api/analytics/summary` - Get summary stats
- `GET /api/analytics/daily` - Get daily metrics
- `GET /api/analytics/models` - Model usage
- `GET /api/analytics/costs` - Cost breakdown

### API Keys
- `GET /api/api-keys` - List keys
- `POST /api/api-keys` - Create key
- `DELETE /api/api-keys/{id}` - Delete key

### Billing
- `GET /api/billing/plan` - Get plan
- `POST /api/billing/upgrade` - Upgrade plan
- `GET /api/billing/invoices` - Get invoices
- `GET /api/billing/usage` - Get usage

### Settings
- `GET /api/settings/profile` - Get profile
- `PUT /api/settings/profile` - Update profile
- `GET /api/settings/preferences` - Get preferences
- `POST /api/settings/change-password` - Change password

## Configuration

All settings are loaded from environment variables. See `.env.example` for all options.

**Key Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT secret key
- `OPENAI_API_KEY` - OpenAI API key
- `GEMINI_API_KEY` - Google Gemini API key
- `GROQ_API_KEY` - Groq API key
- `OLLAMA_BASE_URL` - Local Ollama server URL

## Deployment

### Docker

```bash
# Build image
docker build -t smartllm-api .

# Run container
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e SECRET_KEY=your-secret \
  smartllm-api
```

### AWS ECS

```bash
# Push image to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com

docker build -t smartllm-api .
docker tag smartllm-api:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/smartllm-api:latest
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/smartllm-api:latest

# Create task definition and service in ECS console
```

### GCP Cloud Run

```bash
# Build and push to GCP
gcloud builds submit --tag gcr.io/your-project/smartllm-api

# Deploy
gcloud run deploy smartllm-api \
  --image gcr.io/your-project/smartllm-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=postgresql://...
```

### Vercel (Python support)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Architecture

```
app/
├── models/           # SQLAlchemy ORM models
├── schemas/          # Pydantic request/response schemas
├── routes/           # API endpoint handlers
├── services/         # Business logic
│   ├── llm_providers.py    # LLM integrations
│   ├── prompt_optimizer.py # Prompt optimization
│   ├── model_router.py     # Model recommendations
│   └── analytics_service.py# Analytics aggregation
├── utils/            # Helper utilities
├── config.py         # Settings management
├── database.py       # Database connection
└── main.py           # FastAPI app initialization
```

## Database Schema

### Users
- id, email, full_name, hashed_password, is_active, is_verified, created_at

### Projects
- id, owner_id, name, description, total_requests, total_cost, monthly_cost, cache_hit_rate, created_at

### Prompts & Responses
- Prompt: id, user_id, project_id, system_prompt, user_prompt, model, tokens, cost
- Response: id, prompt_id, content, tokens_used, latency_ms, success

### Analytics
- id, user_id, project_id, date, requests, tokens, cost, cache_hits, latency

### API Keys
- id, user_id, project_id, key (hashed), name, total_requests, is_active

### Billing Plans & Invoices
- BillingPlan: id, user_id, plan_type, monthly_cost, limits
- Invoice: id, billing_plan_id, amount, status, period

## LLM Providers

### OpenAI
- Models: gpt-4, gpt-4o, gpt-3.5-turbo
- Cost: $0.03-0.06/1K tokens
- Quality: Excellent

### Gemini
- Models: gemini-2.5-pro, gemini-2.5-flash
- Cost: $0.00007-0.0005/1K tokens
- Quality: Very good

### Groq
- Models: mixtral-8x7b, llama
- Speed: Ultra-fast (200ms avg)
- Cost: $0.00024/1K tokens

### Ollama
- Models: llama2, mistral, neural-chat
- Cost: Free (local)
- Speed: Depends on hardware

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_auth.py -v
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql smartllm -c "SELECT 1"

# View connection string
echo $DATABASE_URL
```

### LLM Provider Errors
- Ensure API keys are set in `.env`
- Check rate limits (especially for free tiers)
- Verify network connectivity for Ollama

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

## Security

- JWT tokens expire after 30 minutes
- API keys are hashed in database
- Passwords use bcrypt hashing
- CORS restricted to configured origins
- SQL injection prevention via SQLAlchemy ORM

## Support

For issues or questions:
1. Check this README
2. Review API docs at `/docs`
3. Check GitHub issues
4. Open a new issue with details

## License

MIT
