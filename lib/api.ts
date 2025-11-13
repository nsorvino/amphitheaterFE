const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

type RequestOptions = RequestInit & { parse?: 'json' | 'text' | 'auto' };

const buildUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

async function parseResponse<T>(response: Response, parse: 'json' | 'text' | 'auto' = 'auto'): Promise<T> {
  if (parse === 'text') {
    return (await response.text()) as unknown as T;
  }

  if (parse === 'json') {
    return (await response.json()) as T;
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return (await response.json()) as T;
  }

  if (contentType?.includes('text/')) {
    return (await response.text()) as unknown as T;
  }

  // No content or unexpected content-type
  return (undefined as unknown) as T;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { parse = 'auto', headers, ...restOptions } = options;

  const mergedHeaders = {
    Accept: 'application/json',
    ...(restOptions.body && !(restOptions.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...headers,
  };

  const response = await fetch(buildUrl(path), { ...restOptions, headers: mergedHeaders });

  if (!response.ok) {
    const errorBody = await response.text();
    const error = new Error(`Request failed with status ${response.status}: ${errorBody || response.statusText}`);
    (error as any).status = response.status;
    (error as any).body = errorBody;
    throw error;
  }

  return parseResponse<T>(response, parse);
}

export interface BackendUser {
  id: number | string;
  name: string;
  role: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileQueueItem {
  id: number | string;
}

export interface FiltersResponse {
  filter_roles: string | null;
  filter_location: string | null;
}

export interface ProfileSettingsResponse {
  id?: number;
  user_id?: number;
  visibility?: 'public' | 'private' | 'friends_only';
  notifications_enabled?: boolean;
  match_distance?: number | null;
  preferred_roles?: string | null;
  bio?: string | null;
  filter_roles?: string | null;
  filter_location?: string | null;
  goals?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateFiltersPayload {
  filter_roles?: string | null;
  filter_location?: string | null;
  preferred_roles?: string | null;
  bio?: string | null;
  goals?: string | null;
}

export interface MatchesResponse {
  matches: number[];
}

export const api = {
  getUser: (userId: number | string) => request<{ user: BackendUser }>(`/users/user/${userId}`),
  updateUser: (userId: number | string, payload: { name: string; role: string; location: string }) =>
    request(`/users/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getProfileQueue: (
    userId: number | string,
    params: { offset?: number; limit?: number } = {}
  ) => {
    const query: string[] = [];
    if (typeof params.offset === 'number' && params.offset >= 0) {
      query.push(`offset=${encodeURIComponent(params.offset)}`);
    }
    if (typeof params.limit === 'number' && params.limit > 0) {
      query.push(`limit=${encodeURIComponent(params.limit)}`);
    }
    const suffix = query.length > 0 ? `?${query.join('&')}` : '';
    return request<ProfileQueueItem[]>(`/users/profile-queue/${userId}${suffix}`);
  },
  likeUser: (userId: number | string, likedUserId: number | string) =>
    request(`/users/users/${userId}/like/${likedUserId}`, { method: 'POST', parse: 'text' }),
  dislikeUser: (userId: number | string, dislikedUserId: number | string) =>
    request(`/users/users/${userId}/dislike/${dislikedUserId}`, { method: 'POST', parse: 'text' }),
  getFilters: (userId: number | string) => request<FiltersResponse>(`/users/filters/${userId}`),
  getProfileSettings: (userId: number | string) =>
    request<ProfileSettingsResponse>(`/users/profile-settings/${userId}`),
  updateFilters: (userId: number | string, payload: UpdateFiltersPayload) =>
    request(`/users/filters/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getMatches: (userId: number | string) => request<MatchesResponse>(`/users/matches/${userId}`),
  login: (credentials: { emailOrPhone: string; password: string }) =>
    request(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () =>
    request(`/auth/logout`, {
      method: 'POST',
      parse: 'text',
    }),
  register: (payload: Record<string, unknown>) =>
    request(`/auth/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export { API_BASE_URL };

