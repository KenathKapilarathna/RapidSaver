import { describe, test, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

// Properly mock react-geocode first
vi.mock('react-geocode', async () => {
  const actual = await vi.importActual('react-geocode');
  return {
    ...actual,
    default: {
      setKey: vi.fn(),
      setLanguage: vi.fn(),
      setRegion: vi.fn(),
      setLocationType: vi.fn(),
      fromAddress: vi.fn()
    }
  };
});

// Setup environment
beforeAll(() => {
  vi.stubEnv('VITE_GEOCODING_API_KEY', 'test-key');
});

// Create test components with clear, unique text
const TestHome = () => <div data-testid="home-page">TEST_HOME_PAGE_CONTENT</div>;
const TestLogin = () => <div data-testid="login-page">TEST_LOGIN_PAGE_CONTENT</div>;
const TestBooking = () => <div data-testid="booking-page">TEST_BOOKING_PAGE_CONTENT</div>;

// Create test routes
const testRoutes = [
  {
    path: "/",
    element: <TestHome />,
  },
  {
    path: "/login",
    element: <TestLogin />,
  },
  {
    path: "/booking",
    element: <TestBooking />,
  }
];

describe('Router Configuration', () => {
  test('renders home page for root route', async () => {
    render(
      <RouterProvider router={createMemoryRouter(testRoutes, {
        initialEntries: ['/'],
      })} />
    );
    
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByText(/TEST_HOME_PAGE_CONTENT/i)).toBeInTheDocument();
  });

  test('renders login page for /login route', async () => {
    render(
      <RouterProvider router={createMemoryRouter(testRoutes, {
        initialEntries: ['/login'],
      })} />
    );
    
    expect(await screen.findByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByText(/TEST_LOGIN_PAGE_CONTENT/i)).toBeInTheDocument();
  });

  test('renders booking page without geocode errors', async () => {
    render(
      <RouterProvider router={createMemoryRouter(testRoutes, {
        initialEntries: ['/booking'],
      })} />
    );
    
    expect(await screen.findByTestId('booking-page')).toBeInTheDocument();
    expect(screen.getByText(/TEST_BOOKING_PAGE_CONTENT/i)).toBeInTheDocument();
  });
});