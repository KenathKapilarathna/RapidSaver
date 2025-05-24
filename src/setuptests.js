import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';


// Global mocks can be placed here
vi.mock('react-geocode', () => ({
  __esModule: true,
  default: {
    setKey: vi.fn(),
    setLanguage: vi.fn(),
    setRegion: vi.fn(),
    setLocationType: vi.fn(),
    fromAddress: vi.fn()
  }
}));