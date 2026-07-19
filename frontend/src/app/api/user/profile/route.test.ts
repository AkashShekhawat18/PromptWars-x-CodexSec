import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { GET, POST } from './route';
import { prisma } from '@/lib/prisma';
import { requireAuthUser } from '@/lib/api-auth';

describe('User Profile API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if unauthorized', async () => {
    (requireAuthUser as any).mockRejectedValueOnce(new Error("UNAUTHORIZED"));
    const { req } = createMocks({ method: 'GET' });
    const response = await GET(req as any);
    expect(response.status).toBe(401);
  });

  it('should return user profile if authorized', async () => {
    // Mock user
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User'
    });

    const { req } = createMocks({
      method: 'GET',
      headers: { cookie: 'auth-token=valid-token' } // Mock auth
    });
    
    // For Next.js App Router we construct NextRequest
    const nextReq = new Request('http://localhost/api/user/profile', {
      headers: { cookie: 'auth-token=valid-token' }
    });

    const response = await GET(nextReq as any);
    expect(response.status).toBe(200);
  });
});
