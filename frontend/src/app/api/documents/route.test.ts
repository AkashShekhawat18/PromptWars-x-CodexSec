import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { prisma } from '@/lib/prisma';
import { requireAuthUser } from '@/lib/api-auth';

describe('Documents API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if unauthorized', async () => {
    (requireAuthUser as any).mockRejectedValueOnce(new Error("UNAUTHORIZED"));
    const nextReq = new Request('http://localhost/api/documents');
    const response = await GET(nextReq as any);
    expect(response.status).toBe(401);
  });

  it('should list documents if authorized', async () => {
    (prisma.document.findMany as any).mockResolvedValue([
      { id: '1', originalName: 'doc1.pdf', size: 1048576, mimeType: 'application/pdf', status: 'PROCESSED', createdAt: new Date() }
    ]);

    const nextReq = new Request('http://localhost/api/documents', {
      headers: { cookie: 'auth-token=valid-token' }
    });

    const response = await GET(nextReq as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'doc1.pdf' })
    ]));
  });
});
