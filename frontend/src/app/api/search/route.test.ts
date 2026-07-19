import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { requireAuthUser } from '@/lib/api-auth';

describe('Search API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 if query is missing', async () => {
    const nextReq = new Request('http://localhost/api/search');
    const response = await GET(nextReq as any);
    expect(response.status).toBe(200);
  });

  it('should return 401 if unauthorized', async () => {
    (requireAuthUser as any).mockRejectedValueOnce(new Error("UNAUTHORIZED"));
    const nextReq = new Request('http://localhost/api/search?q=test');
    const response = await GET(nextReq as any);
    expect(response.status).toBe(401);
  });
});
