/**
 * Zuupah API client
 * Set EXPO_PUBLIC_API_URL in your .env to point to your backend
 * e.g. EXPO_PUBLIC_API_URL=http://localhost:4000
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = '@zuupah_api_token';

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  method: string,
  path: string,
  body?: object | FormData,
  auth = true
): Promise<T> {
  const headers: Record<string, string> = {};
  const isFormData = body instanceof FormData;

  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error(err.error ?? 'Request failed'), { status: res.status });
  }

  return res.json();
}

export const apiClient = {
  get:    <T>(path: string, auth = true) => request<T>('GET',    path, undefined, auth),
  post:   <T>(path: string, body: object | FormData, auth = true) => request<T>('POST',  path, body, auth),
  put:    <T>(path: string, body: object | FormData, auth = true) => request<T>('PUT',   path, body, auth),
  delete: <T>(path: string, auth = true) => request<T>('DELETE', path, undefined, auth),
};

export default apiClient;
