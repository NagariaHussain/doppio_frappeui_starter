import { vi } from "vitest"

// Mock global browser APIs for tests that might need them
global.window = {
    location: {
        hostname: "localhost",
        port: "3000",
        protocol: "http:",
    },
    site_name: "test-site",
}

global.document = {
    createElement: vi.fn(),
    querySelector: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
}

// Setup console mocks to avoid noise in tests
global.console = {
    ...console,
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
}
