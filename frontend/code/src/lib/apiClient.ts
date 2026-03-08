/**
 * apiClient — Cliente HTTP centralizado com Silent Refresh automático.
 * 
 * Quando uma requisição retorna 401 (token expirado), ele:
 *  1. Chama POST /auth/refresh com o refresh_token salvo
 *  2. Salva os novos tokens no localStorage
 *  3. Repete a requisição original com o novo access_token
 *  4. Se o refresh também falhar, faz logout e redireciona para /login
 */

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function runRefresh(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  const response = await fetch('http://localhost:3001/auth/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) return null;

  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  return data.access_token;
}

function logoutAndRedirect() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
}

export async function apiClient(url: string, options: RequestInit = {}): Promise<Response> {
  // Injeta automaticamente o Authorization header
  const token = localStorage.getItem('access_token');
  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, { ...options, headers });

  // Se não for 401, retorna diretamente
  if (response.status !== 401) return response;

  // É 401 — precisamos renovar o token
  if (isRefreshing) {
    // Já tem um refresh em andamento: entra na fila e aguarda o novo token
    return new Promise((resolve, reject) => {
      refreshQueue.push(async (newToken: string) => {
        headers.set('Authorization', `Bearer ${newToken}`);
        try {
          resolve(await fetch(url, { ...options, headers }));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  // Inicia o refresh
  isRefreshing = true;

  try {
    const newToken = await runRefresh();

    if (!newToken) {
      logoutAndRedirect();
      throw new Error('Sessão expirada. Redirecionando para o login.');
    }

    // Notifica todos que estavam na fila
    refreshQueue.forEach(cb => cb(newToken));
    refreshQueue = [];

    // Repete a requisição original com o novo token
    headers.set('Authorization', `Bearer ${newToken}`);
    response = await fetch(url, { ...options, headers });
    return response;

  } finally {
    isRefreshing = false;
  }
}
