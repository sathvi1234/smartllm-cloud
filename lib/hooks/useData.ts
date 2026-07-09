import { useEffect, useState } from 'react';
import { apiClient } from '../api-client';

export function useDashboardData() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const analytics = await apiClient.getAnalytics(30);
        setData(analytics);
        setError(null);
      } catch (err) {
        console.error('[v0] Dashboard data fetch failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}

export function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('[v0] Projects fetch failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
}

export function useAnalytics(days: number = 30) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const analyticsData = await apiClient.getDailyAnalytics(days);
        setData(analyticsData);
        setError(null);
      } catch (err) {
        console.error('[v0] Analytics fetch failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  return { data, isLoading, error };
}

export function useAPIKeys() {
  const [keys, setKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getAPIKeys();
        setKeys(data);
        setError(null);
      } catch (err) {
        console.error('[v0] API Keys fetch failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load API keys');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeys();
  }, []);

  return { keys, isLoading, error };
}

export function useBilling() {
  const [billing, setBilling] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getBillingInfo();
        setBilling(data);
        setError(null);
      } catch (err) {
        console.error('[v0] Billing fetch failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load billing');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBilling();
  }, []);

  return { billing, isLoading, error };
}
