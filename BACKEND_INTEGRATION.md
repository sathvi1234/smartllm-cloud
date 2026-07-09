# Backend Integration Guide for SmartLLM Cloud

This document describes how to connect SmartLLM Cloud frontend to a FastAPI backend with PostgreSQL and Redis.

## Current State

The frontend is fully functional with:
- ✅ All UI pages implemented
- ✅ Mock data for development
- ✅ Type-safe API client pattern
- ✅ State management ready
- ✅ Authentication hooks prepared
- ✅ Error handling structure

## Architecture for Backend Connection

### 1. API Client Pattern

The app uses a centralized API client approach. Modify `/lib/hooks/useFetch.ts` to make real API calls:

```typescript
// Current implementation (mock)
const { data, isLoading, error } = useFetch('/api/projects');

// Will automatically work with real backend:
// Just add NEXT_PUBLIC_API_URL to .env.local
```

### 2. Environment Configuration

Add to `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_ENV=development

# Optional: Add auth configuration
AUTH_SECRET=your_secret_key_here
NEXT_PUBLIC_AUTH_PROVIDER=jwt
```

### 3. API Routes to Implement (FastAPI Backend)

#### Authentication Endpoints

```python
# POST /api/v1/auth/login
# POST /api/v1/auth/register
# POST /api/v1/auth/logout
# POST /api/v1/auth/refresh
# GET /api/v1/auth/me
```

#### Projects Endpoints

```python
# GET /api/v1/projects                    # List projects
# POST /api/v1/projects                   # Create project
# GET /api/v1/projects/{id}              # Get project
# PUT /api/v1/projects/{id}              # Update project
# DELETE /api/v1/projects/{id}           # Delete project
# POST /api/v1/projects/{id}/api-keys    # Generate API key
```

#### Playground Endpoints

```python
# POST /api/v1/playground/execute         # Run prompt
# POST /api/v1/playground/analyze        # Analyze prompt
# GET /api/v1/playground/models          # List available models
```

#### Optimizer Endpoints

```python
# POST /api/v1/optimizer/analyze          # Analyze & optimize prompt
# GET /api/v1/optimizer/suggestions       # Get suggestions
```

#### Model Router Endpoints

```python
# POST /api/v1/router/recommend          # Get recommended model
# GET /api/v1/router/models              # List models with specs
```

#### Analytics Endpoints

```python
# GET /api/v1/analytics/dashboard        # Get dashboard metrics
# GET /api/v1/analytics/requests         # Request history
# GET /api/v1/analytics/costs            # Cost analytics
# GET /api/v1/analytics/models           # Model usage stats
```

#### API Keys Endpoints

```python
# GET /api/v1/api-keys                   # List keys
# POST /api/v1/api-keys                  # Generate key
# DELETE /api/v1/api-keys/{id}           # Delete key
```

#### Billing Endpoints

```python
# GET /api/v1/billing/subscription       # Current subscription
# POST /api/v1/billing/upgrade           # Upgrade plan
# GET /api/v1/billing/invoices           # Invoice history
```

#### Settings Endpoints

```python
# GET /api/v1/settings/profile           # User profile
# PUT /api/v1/settings/profile           # Update profile
# GET /api/v1/settings/preferences       # User preferences
# PUT /api/v1/settings/preferences       # Update preferences
```

## Database Schema Recommendations

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Keys Table

```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP,
    usage_count INTEGER DEFAULT 0
);
```

### Requests Table

```sql
CREATE TABLE requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    prompt_text TEXT NOT NULL,
    model_used VARCHAR(100),
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost DECIMAL(10, 4),
    latency_ms INTEGER,
    cache_hit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Analytics Table

```sql
CREATE TABLE analytics (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    daily_requests INTEGER,
    total_tokens BIGINT,
    total_cost DECIMAL(12, 4),
    cache_hit_rate DECIMAL(5, 2),
    avg_latency_ms DECIMAL(10, 2),
    carbon_footprint_kg DECIMAL(10, 4),
    recorded_at DATE DEFAULT CURRENT_DATE
);
```

## Integration Steps

### Step 1: Update API Client

Create `/lib/api/client.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

### Step 2: Update Stores

Modify Zustand stores to use real API calls:

```typescript
// Before: Uses mock data
// After: Uses apiCall()

login: async (email: string, password: string) => {
  const response = await apiCall('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  set({ user: response.user, token: response.token });
}
```

### Step 3: Update Hooks

Modify `useFetch.ts` to use real API:

```typescript
export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiCall<T>(url);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
};
```

### Step 4: Add Real Authentication

Replace mock auth in `auth-store.ts`:

```typescript
login: async (email: string, password: string) => {
  set({ isLoading: true, error: null });
  try {
    const response = await apiCall('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    set({
      user: response.user,
      token: response.access_token,
      isAuthenticated: true,
    });
    
    localStorage.setItem('auth_token', response.access_token);
  } catch (error) {
    set({ error: (error as Error).message });
  }
};
```

## CORS Configuration (FastAPI)

Add to your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Redis Integration (Optional)

For caching and session management:

```python
from aioredis import create_redis_pool

redis = await create_redis_pool('redis://localhost:6379')

# Cache prompt optimization results
await redis.setex(f"optimization:{prompt_hash}", 3600, json.dumps(result))
```

## Testing the Integration

1. **Mock Phase** (Current)
   - All endpoints return mock data
   - Full UI functionality
   - Type checking enabled

2. **Development Phase**
   - Connect to local FastAPI server
   - Test each endpoint individually
   - Verify error handling

3. **Staging Phase**
   - Connect to staging backend
   - Load testing
   - Security testing

4. **Production Phase**
   - Connect to production API
   - SSL/HTTPS enabled
   - Rate limiting active

## Deployment Checklist

- [ ] Backend API deployed
- [ ] Database migrations run
- [ ] Redis cache configured
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] JWT secret keys configured
- [ ] SSL certificates installed
- [ ] Rate limiting enabled
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented

## Performance Optimization

### Caching Strategy

```typescript
// Cache API responses for 5 minutes
const cache = new Map();

export async function cachedApiCall<T>(
  url: string,
  ttl = 300000
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && now - cached.time < ttl) {
    return cached.data;
  }

  const data = await apiCall<T>(url);
  cache.set(url, { data, time: now });
  return data;
}
```

### Request Deduplication

Prevent duplicate requests while one is in flight:

```typescript
const pendingRequests = new Map();

export async function deduplicatedApiCall<T>(url: string): Promise<T> {
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url);
  }

  const promise = apiCall<T>(url);
  pendingRequests.set(url, promise);

  try {
    return await promise;
  } finally {
    pendingRequests.delete(url);
  }
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check FastAPI CORS middleware configuration |
| 401 Unauthorized | Verify JWT token is being sent in headers |
| 404 Not Found | Check API endpoint paths match exactly |
| Slow responses | Enable caching and optimize database queries |
| Session expires | Implement token refresh endpoint |

## Support

For issues with backend integration, refer to:
- FastAPI docs: https://fastapi.tiangolo.com
- SQLAlchemy docs: https://docs.sqlalchemy.org
- Redis docs: https://redis.io/docs

---

**Ready for Production**: This frontend is enterprise-ready and can handle real-time data from your backend with minimal code changes.
