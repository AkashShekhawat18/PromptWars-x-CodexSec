import "@testing-library/jest-dom";
import { vi } from "vitest";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Global mocks for external services
vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    user = { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() };
    task = { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
    document = { findMany: vi.fn(), create: vi.fn(), delete: vi.fn() };
    workflow = { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
    auditLog = { create: vi.fn(), findMany: vi.fn() };
    apiUsage = { findUnique: vi.fn(), upsert: vi.fn() };
  }
}));

vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: vi.fn().mockReturnValue({
      get: vi.fn(),
      set: vi.fn(),
      incr: vi.fn(),
      expire: vi.fn(),
    })
  }
}));

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: { upload: vi.fn(), destroy: vi.fn() },
    search: { expression: vi.fn().mockReturnThis(), sort_by: vi.fn().mockReturnThis(), max_results: vi.fn().mockReturnThis(), execute: vi.fn() }
  }
}));

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: () => "Mocked AI response"
      }),
      embedContent: vi.fn().mockResolvedValue({
        embedding: { values: [0.1, 0.2, 0.3] }
      })
    };
  }
}));

vi.mock('@/lib/api-auth', () => ({
  requireAuthUser: vi.fn().mockResolvedValue({ id: 'user-123', role: 'USER', email: 'test@example.com' }),
  requireAdminUser: vi.fn().mockResolvedValue({ id: 'admin-123', role: 'ADMIN', email: 'admin@example.com' })
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue({ value: 'mocked-token' })
  }),
  headers: vi.fn().mockReturnValue({
    get: vi.fn()
  })
}));

// Mock matchMedia for jsdom
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock ResizeObserver for components using it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
