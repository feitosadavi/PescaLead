export class ServiceError extends Error {
  constructor(message: string, public status?: number) { super(message); this.name = 'ServiceError'; }
}

export async function request(url: string, init: RequestInit = {}, timeout = 25000): Promise<Response> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), timeout);
  try {
    const response = await fetch(url, { ...init, signal: abort.signal });
    if (!response.ok) throw new ServiceError(response.status === 429 ? 'Cota ou limite do serviço atingido. Aguarde antes de tentar novamente.' : `Serviço indisponível (HTTP ${response.status}). Tente novamente mais tarde.`, response.status);
    return response;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    if (error instanceof Error && error.name === 'AbortError') throw new ServiceError('A consulta demorou demais. Reduza o raio ou tente novamente.');
    throw new ServiceError('Não foi possível acessar o serviço. Verifique a conexão; no navegador, a fonte também pode restringir o acesso.');
  } finally { clearTimeout(timer); }
}

export function publicHttps(raw: string): string | undefined {
  try {
    const url = new URL(raw.startsWith('www.') ? `https://${raw}` : raw);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password || !host.includes('.') || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) || host.endsWith('.local')) return;
    return url.toString();
  } catch { return; }
}
