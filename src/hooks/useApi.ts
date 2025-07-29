import { useEffect, useState, useCallback } from "react";
import { AxiosResponse } from "axios";
import { api } from "../lib/api";

interface UseApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  params?: Record<string, any>; // query params
  immediate?: boolean; // executa automaticamente no mount
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (override?: Partial<UseApiOptions>) => Promise<void>;
}

export function useApi<T = any>(
  endpoint: string,
  {
    method = "GET",
    body = null,
    params = {},
    immediate = true,
  }: UseApiOptions = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (override: Partial<UseApiOptions> = {}) => {
      setLoading(true);
      setError(null);

      try {
        const finalMethod = override.method || method;
        const finalBody = override.body ?? body;
        const finalParams = { ...params, ...(override.params || {}) };

        let response: AxiosResponse<T>;
        switch (finalMethod) {
          case "POST":
            response = await api.post(endpoint, finalBody, { params: finalParams });
            break;
          case "PUT":
            response = await api.put(endpoint, finalBody, { params: finalParams });
            break;
          case "DELETE":
            response = await api.delete(endpoint, { params: finalParams });
            break;
          default:
            response = await api.get(endpoint, { params: finalParams });
        }
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Erro na requisição");
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method, body, params]
  );

  useEffect(() => {
    if (immediate) fetchData();
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
}
