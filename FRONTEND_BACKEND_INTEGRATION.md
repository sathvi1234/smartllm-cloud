# Frontend-Backend Integration Guide

Complete guide to connect the SmartLLM Cloud frontend (Next.js) with the backend (FastAPI).

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  Next.js Frontend (Port 3000)           │
│  - UI Components                        │
│  - State Management (Zustand)           │
│  - Mock Data Layer                      │
└──────────────┬──────────────────────────┘
               │ HTTP/CORS
               ▼
┌─────────────────────────────────────────┐
│  FastAPI Backend (Port 8000)            │
│  - REST API Endpoints                   │
│  - Database (PostgreSQL)                │
│  - LLM Integrations                     │
│  - Authentication (JWT)                 │
└─────────────────────────────────────────┘
```

## Setup

### 1. Backend Setup

```bash
cd backend

# Create environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Edit .env with your settings (keep defaults for local dev)

# Start with Docker Compose (recommended)
docker-compose up -d

# Or start locally (requires PostgreSQL and Redis)
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd /path/to/project  # Project root

# Install dependencies (if not already done)
pnpm install

# Start dev server
pnpm dev  # Runs on http://localhost:3000
```

### 3. Verify Both Services

```bash
# In separate terminals:
# Terminal 1 - Backend
docker-compose up -d  # Or uvicorn command

# Terminal 2 - Frontend  
pnpm dev

# Terminal 3 - Test connectivity
curl http://localhost:8000/health
# Should return: {"status":"ok","version":"1.0.0"}

curl http://localhost:3000
# Should return the landing page HTML
```

## API Integration

### Environment Variables

Create/update `/app/.env.local` in the frontend:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Update API Client

The frontend has a mock API client at `lib/hooks/useFetch.ts`. Update it to use real backend:

**Current (Mock):**
```typescript
export const useFetch = (endpoint: string) => {
  // Returns mock data
  return { data: mockData[endpoint] }
}
```

**Updated (Real API):**
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useFetch = (endpoint: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get(endpoint)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading, error };
};
```

### Authentication Flow

**1. Register:**
```typescript
// POST /api/auth/register
const response = await fetch('http://localhost:8000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    full_name: 'John Doe',
    password: 'secure_password'
  })
});
```

**2. Login:**
```typescript
// POST /api/auth/login
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'secure_password'
  })
});

const { access_token, token_type } = await response.json();
localStorage.setItem('auth_token', access_token);
```

**3. Update Auth Store:**
```typescript
// lib/store/auth-store.ts
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const { access_token } = await response.json();
    set({ token: access_token, isAuthenticated: true });
    localStorage.setItem('auth_token', access_token);
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem('auth_token');
  }
}));
```

## API Endpoints Reference

### Authentication
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/register` | email, full_name, password | User, token |
| POST | `/api/auth/login` | email, password | access_token, expires_in |
| GET | `/api/auth/me` | - | User details |
| POST | `/api/auth/refresh` | - | New token |

### Projects
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/{id}` | Get project details |
| PUT | `/api/projects/{id}` | Update project |
| DELETE | `/api/projects/{id}` | Delete project |

### Playground
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/prompts/playground` | system_prompt, user_prompt, model, temperature, max_tokens |
| POST | `/api/prompts/optimize` | prompt |
| POST | `/api/prompts/route` | prompt, speed_priority, cost_priority |
| GET | `/api/prompts/models` | - |

### Analytics
| Method | Endpoint | Query Params |
|--------|----------|--------------|
| GET | `/api/analytics/summary` | period (7_days, 30_days, 90_days, all_time) |
| GET | `/api/analytics/daily` | project_id (optional) |
| GET | `/api/analytics/models` | - |
| GET | `/api/analytics/costs` | - |

### API Keys
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/api-keys` | List API keys |
| POST | `/api/api-keys` | Create new key |
| DELETE | `/api/api-keys/{id}` | Delete key |

### Billing
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/billing/plan` | Get current plan |
| POST | `/api/billing/upgrade` | Upgrade plan |
| GET | `/api/billing/invoices` | List invoices |
| GET | `/api/billing/usage` | Get usage stats |

### Settings
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/settings/profile` | Get user profile |
| PUT | `/api/settings/profile` | Update profile |
| POST | `/api/settings/change-password` | Change password |

## Error Handling

Backend returns standard HTTP status codes:

```typescript
// Handle API responses
const handleResponse = (response: Response) => {
  switch (response.status) {
    case 200:
    case 201:
      return response.json();
    case 401:
      // Unauthorized - redirect to login
      window.location.href = '/login';
      throw new Error('Unauthorized');
    case 403:
      // Forbidden
      throw new Error('You do not have permission');
    case 404:
      throw new Error('Resource not found');
    case 409:
      throw new Error('Resource already exists');
    case 422:
      // Validation error
      return response.json().then(data => {
        throw new Error(data.detail);
      });
    case 500:
      throw new Error('Server error');
    default:
      throw new Error('Unknown error');
  }
};
```

## Testing the Connection

### 1. Manual Testing with cURL

```bash
# Check health
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Use the access_token in next requests
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test with Frontend

1. Open http://localhost:3000
2. Click "Sign Up"
3. Register with test credentials
4. Should redirect to dashboard
5. Check browser console for API calls
6. Verify data is loading from backend

### 3. Check API Documentation

FastAPI generates automatic docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## CORS Configuration

Backend allows requests from:
- http://localhost:3000 (development)
- http://localhost:3001 (alternative)

To add more origins, edit `backend/.env`:

```env
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001", "https://example.com"]
```

## Database

### Local Development

Backend uses SQLite by default for easy local development:
```
app.db  # SQLite file, auto-created
```

### Production (PostgreSQL + Neon)

For production, use Neon PostgreSQL:

1. Create account at https://neon.tech
2. Create project and database
3. Get connection string
4. Update `.env`:
```env
DATABASE_URL=postgresql+asyncpg://user:password@host/database
```

## Deployment

### Deploy Frontend to Vercel

```bash
cd /path/to/project
vercel --prod

# Update environment variable
vercel env add NEXT_PUBLIC_API_URL https://api.example.com
```

### Deploy Backend to AWS/GCP

See `backend/README.md` for detailed deployment instructions.

## Troubleshooting

### CORS Errors
- Check backend CORS_ORIGINS in .env
- Verify frontend URL is in the list
- Restart backend after changes

### 401 Unauthorized
- Token expired - refresh or re-login
- Token not sent in Authorization header
- Check token stored in localStorage

### 404 Not Found
- Endpoint doesn't exist - check spelling
- Wrong API URL - verify NEXT_PUBLIC_API_URL
- Backend not running - start with `docker-compose up`

### Database Connection Issues
- PostgreSQL not running - start with Docker
- Connection string incorrect - check .env
- Database doesn't exist - create with `createdb smartllm`

### LLM Provider Errors
- API keys not configured - add to .env
- Rate limit hit - wait or use different model
- Network issue - check firewall/proxy

## Performance Tips

1. **Implement Caching**
   - Use SWR for automatic caching
   - Implement Redis on backend for expensive queries

2. **Lazy Load Analytics**
   - Load charts only when tab is active
   - Implement pagination for large datasets

3. **Optimize Database**
   - Add indexes on frequently queried fields
   - Use connection pooling

4. **Monitor Performance**
   - Check Network tab in DevTools
   - Monitor backend logs
   - Set up performance monitoring (Sentry, etc.)

## Next Steps

1. ✅ Get both services running
2. ✅ Test basic connectivity
3. ✅ Implement authentication flow
4. ✅ Connect database queries
5. ✅ Test all CRUD operations
6. ✅ Implement error handling
7. ✅ Add loading states
8. ✅ Deploy to production

