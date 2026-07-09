import { Project, DashboardStats, AnalyticsMetrics, Response, CacheEntry } from './types';

export const mockProjects: Project[] = [
  {
    id: '1',
    userId: '1',
    name: 'E-commerce Platform',
    description: 'Product recommendations and customer support chatbot',
    apiKey: 'sk_live_1234567890abcdef',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    totalRequests: 15240,
    monthlyCost: 287.54,
    cacheHitRate: 34.2,
  },
  {
    id: '2',
    userId: '1',
    name: 'Content Generation',
    description: 'Blog post and social media content creation',
    apiKey: 'sk_live_0987654321fedcba',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    totalRequests: 8920,
    monthlyCost: 156.78,
    cacheHitRate: 22.1,
  },
  {
    id: '3',
    userId: '1',
    name: 'Data Analysis',
    description: 'Converting raw data into insights',
    apiKey: 'sk_live_abcdef1234567890',
    status: 'active',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date(),
    totalRequests: 4567,
    monthlyCost: 89.23,
    cacheHitRate: 18.5,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalRequests: 28727,
  totalTokens: 15234892,
  aiCost: 533.55,
  moneySaved: 287.42,
  cacheHitRate: 28.4,
  activeModels: ['GPT-4o', 'Gemini 2.5 Flash', 'Groq Llama 3.1'],
  avgLatency: 542,
  carbonFootprint: 12.4,
};

export const generateMockAnalyticsData = (): AnalyticsMetrics[] => {
  const data: AnalyticsMetrics[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date,
      requests: Math.floor(Math.random() * 2000) + 500,
      totalTokens: Math.floor(Math.random() * 800000) + 200000,
      totalCost: Math.floor(Math.random() * 50) + 10,
      cacheHits: Math.floor(Math.random() * 400) + 100,
      cacheMisses: Math.floor(Math.random() * 800) + 200,
      avgLatency: Math.floor(Math.random() * 800) + 200,
      modelUsage: {
        'gpt-4-turbo': Math.floor(Math.random() * 300) + 50,
        'gpt-4o': Math.floor(Math.random() * 600) + 150,
        'gemini-2.5-pro': Math.floor(Math.random() * 200) + 30,
        'gemini-2.5-flash': Math.floor(Math.random() * 800) + 200,
        'groq-llama': Math.floor(Math.random() * 400) + 100,
        deepseek: Math.floor(Math.random() * 250) + 50,
        'ollama-local': Math.floor(Math.random() * 100) + 10,
      },
      carbonFootprint: (Math.random() * 0.8 + 0.2).toFixed(2) as unknown as number,
    });
  }

  return data;
};

export const mockResponses: Response[] = [
  {
    id: '1',
    promptId: '1',
    content:
      'Based on the customer purchase history and browsing patterns, I recommend these personalized products: electronics, home and garden, sports equipment...',
    inputTokens: 245,
    outputTokens: 128,
    cost: 0.0089,
    latency: 523,
    model: 'gpt-4o',
    cacheHit: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    promptId: '2',
    content:
      'The quarterly report shows a 23% increase in revenue, driven by strong sales in the Asia-Pacific region. Key insights include...',
    inputTokens: 512,
    outputTokens: 284,
    cost: 0.0234,
    latency: 687,
    model: 'gpt-4-turbo',
    cacheHit: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '3',
    promptId: '3',
    content:
      'Top 5 blog topics for this month: 1) AI trends in 2024, 2) Productivity hacks, 3) Remote work best practices...',
    inputTokens: 156,
    outputTokens: 89,
    cost: 0.0045,
    latency: 234,
    model: 'gemini-2.5-flash',
    cacheHit: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

export const mockCacheEntries: CacheEntry[] = [
  {
    id: '1',
    promptHash: 'hash_abc123',
    originalPrompt: 'What are the top 10 AI trends in 2024?',
    response:
      '1. Multimodal AI systems gaining mainstream adoption\n2. Increased focus on AI safety and alignment...',
    similarity: 98,
    inputTokens: 145,
    outputTokens: 267,
    cost: 0.0124,
    timeSaved: 2340,
    moneySaved: 0.0089,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    accessCount: 12,
  },
  {
    id: '2',
    promptHash: 'hash_def456',
    originalPrompt: 'Write a professional email template for project proposals',
    response: 'Subject: [Project Name] - Proposal for Discussion\n\nDear [Client Name]...',
    similarity: 95,
    inputTokens: 87,
    outputTokens: 142,
    cost: 0.0056,
    timeSaved: 1200,
    moneySaved: 0.0042,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
    accessCount: 8,
  },
  {
    id: '3',
    promptHash: 'hash_ghi789',
    originalPrompt: 'Generate a Python script for data processing',
    response: 'import pandas as pd\nimport numpy as np\n\ndef process_data(input_file)...',
    similarity: 92,
    inputTokens: 156,
    outputTokens: 234,
    cost: 0.0145,
    timeSaved: 1890,
    moneySaved: 0.0078,
    createdAt: new Date(Date.now() - 1000 * 60 * 240),
    accessCount: 5,
  },
];

// For charts
export const mockMonthlyData = [
  { month: 'Jan', requests: 2400, cost: 245, tokens: 1200000 },
  { month: 'Feb', requests: 3210, cost: 318, tokens: 1560000 },
  { month: 'Mar', requests: 2290, cost: 221, tokens: 1280000 },
  { month: 'Apr', requests: 2000, cost: 229, tokens: 950000 },
  { month: 'May', requests: 2181, cost: 200, tokens: 1100000 },
  { month: 'Jun', requests: 2500, cost: 250, tokens: 1350000 },
];

export const mockModelDistribution = [
  { name: 'GPT-4o', value: 4200, color: '#3b82f6' },
  { name: 'Gemini Flash', value: 3800, color: '#8b5cf6' },
  { name: 'Groq Llama', value: 2100, color: '#ec4899' },
  { name: 'GPT-4 Turbo', value: 1200, color: '#f59e0b' },
  { name: 'Gemini Pro', value: 987, color: '#10b981' },
  { name: 'DeepSeek', value: 450, color: '#6366f1' },
];

export const mockModelComparison = [
  {
    model: 'GPT-4o',
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
    latency: 600,
    quality: 92,
    speed: 200,
  },
  {
    model: 'GPT-4 Turbo',
    costPer1kInput: 0.01,
    costPer1kOutput: 0.03,
    latency: 800,
    quality: 95,
    speed: 120,
  },
  {
    model: 'Gemini 2.5 Pro',
    costPer1kInput: 0.0075,
    costPer1kOutput: 0.03,
    latency: 700,
    quality: 93,
    speed: 180,
  },
  {
    model: 'Gemini 2.5 Flash',
    costPer1kInput: 0.0001,
    costPer1kOutput: 0.0004,
    latency: 300,
    quality: 88,
    speed: 300,
  },
  {
    model: 'Groq Llama',
    costPer1kInput: 0.002,
    costPer1kOutput: 0.01,
    latency: 200,
    quality: 87,
    speed: 500,
  },
  {
    model: 'DeepSeek',
    costPer1kInput: 0.00144,
    costPer1kOutput: 0.0072,
    latency: 500,
    quality: 89,
    speed: 250,
  },
];

// Pagination helper
export const paginate = <T,>(items: T[], page: number = 1, pageSize: number = 10) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: items.slice(start, end),
    total: items.length,
    page,
    pageSize,
    hasMore: end < items.length,
  };
};
