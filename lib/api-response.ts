import { HttpError } from './server';

export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}

export async function apiResponse(request: Request, action: () => Promise<Response>) {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const url = new URL(request.url);
      const origin = request.headers.get('origin');
      const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
      const forwardedHost = (request.headers.get('x-forwarded-host') || request.headers.get('host'))?.split(',')[0]?.trim();
      const forwardedOrigin = forwardedProto && forwardedHost ? `${forwardedProto}://${forwardedHost}` : null;
      if (origin !== url.origin && origin !== forwardedOrigin) throw new HttpError('Запрос с другого сайта запрещён.', 403);
    }
    return await action();
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    console.error('TutorPlace API:', error instanceof Error ? error.message : 'Unknown error');
    return json({ error: 'Сервис временно недоступен. Попробуй ещё раз.' }, 503);
  }
}

export async function requestJson(request: Request) {
  return request.json().catch(() => ({})) as Promise<Record<string, unknown>>;
}
