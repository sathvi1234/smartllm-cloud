import { User, Project, APIKey, AnalyticsSummary, BillingInfo } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class APIClient {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `API error: ${response.status}`);
    }
    return response.json();
  }

  // Authentication
  async register(email: string, password: string, fullName: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    return this.handleResponse<User>(response);
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<any>(response);
    this.setToken(data.access_token);
    
    // Get current user
    const userResponse = await this.getCurrentUser();
    
    return {
      token: data.access_token,
      user: userResponse,
    };
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Project[]>(response);
  }

  async getProject(id: number): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Project>(response);
  }

  async createProject(data: { name: string; description?: string }): Promise<Project> {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Project>(response);
  }

  async updateProject(id: number, data: { name?: string; description?: string }): Promise<Project> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Project>(response);
  }

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    await this.handleResponse<void>(response);
  }

  // Playground
  async runPlayground(data: {
    userPrompt: string;
    systemPrompt?: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
    projectId?: number;
  }): Promise<any> {
    const response = await fetch(`${API_URL}/prompts/playground`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        user_prompt: data.userPrompt,
        system_prompt: data.systemPrompt,
        model: data.model,
        temperature: data.temperature,
        max_tokens: data.maxTokens,
        project_id: data.projectId,
      }),
    });
    return this.handleResponse<any>(response);
  }

  // Prompt Optimization
  async optimizePrompt(prompt: string): Promise<any> {
    const response = await fetch(`${API_URL}/prompts/optimize`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ prompt }),
    });
    return this.handleResponse<any>(response);
  }

  // Model Router
  async routePrompt(prompt: string): Promise<any> {
    const response = await fetch(`${API_URL}/prompts/route`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ prompt }),
    });
    return this.handleResponse<any>(response);
  }

  // Analytics
  async getAnalytics(days: number = 30): Promise<AnalyticsSummary> {
    const response = await fetch(`${API_URL}/analytics/summary?days=${days}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<AnalyticsSummary>(response);
  }

  async getDailyAnalytics(days: number = 30): Promise<any[]> {
    const response = await fetch(`${API_URL}/analytics/daily?days=${days}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  // API Keys
  async getAPIKeys(): Promise<APIKey[]> {
    const response = await fetch(`${API_URL}/api-keys`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<APIKey[]>(response);
  }

  async generateAPIKey(name: string): Promise<APIKey> {
    const response = await fetch(`${API_URL}/api-keys`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name }),
    });
    return this.handleResponse<APIKey>(response);
  }

  async deleteAPIKey(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api-keys/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    await this.handleResponse<void>(response);
  }

  // Billing
  async getBillingInfo(): Promise<BillingInfo> {
    const response = await fetch(`${API_URL}/billing/plan`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<BillingInfo>(response);
  }

  async upgradePlan(plan: string): Promise<any> {
    const response = await fetch(`${API_URL}/billing/upgrade`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ plan }),
    });
    return this.handleResponse<any>(response);
  }

  // Settings
  async updateProfile(data: { fullName?: string; email?: string }): Promise<User> {
    const response = await fetch(`${API_URL}/settings/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<User>(response);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    const response = await fetch(`${API_URL}/settings/change-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
    return this.handleResponse<any>(response);
  }
}

export const apiClient = new APIClient();
