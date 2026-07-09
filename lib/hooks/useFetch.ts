import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface FetchOptions {
  skip?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useFetch = <T,>(
  fetcher: () => Promise<T>,
  dependencies: any[] = [],
  options: FetchOptions = {}
): FetchState<T> & { refetch: () => Promise<void> } => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  const { skip = false, onSuccess, onError } = options;

  const execute = useCallback(async () => {
    setState({ data: null, error: null, isLoading: true });
    try {
      const result = await fetcher();
      setState({ data: result, error: null, isLoading: false });
      onSuccess?.(result);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, error: err, isLoading: false });
      onError?.(err);
    }
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    if (!skip) {
      execute();
    }
  }, [skip, execute, ...dependencies]);

  return {
    ...state,
    refetch: execute,
  };
};
