import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { requireAuthUser } from '@/lib/api-auth';

describe('Second Brain Ask API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if unauthorized', async () => {
    (requireAuthUser as any).mockRejectedValueOnce(new Error("UNAUTHORIZED"));
    const nextReq = new Request('http://localhost/api/second-brain/ask', {
      method: 'POST',
      body: JSON.stringify({ query: 'Hello' })
    });
    const response = await POST(nextReq as any);
    expect(response.status).toBe(401);
  });
});
