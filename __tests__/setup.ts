// Setup file for Jest tests

// Mock fetch for tests
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  jest.clearAllMocks();

  // Reset fetch mock
  (fetch as jest.MockedFunction<typeof fetch>).mockClear();
});

afterEach(() => {
  // Restore console methods
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

// Helper to mock successful schema fetch
export const mockSchemaFetch = (schema: any) => {
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
    ok: true,
    json: async () => schema,
    headers: {
      get: (name: string) => name === 'content-type' ? 'application/json' : null
    }
  } as Response);
};

// Helper to mock failed schema fetch
export const mockSchemaFetchError = (status = 404, statusText = 'Not Found') => {
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
    ok: false,
    status,
    statusText,
    headers: {
      get: () => null
    }
  } as Response);
};
