import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Register from './components/LogIn/Register/Register';
import { AuthContextProvider } from './context/auth.context';
import { DevicesContextProvider } from './context/devices.context';
import { OptionsContextProvider } from './context/options.context';
import ConsumptionPage from './pages/Consumption.page';
import ErrorPage from './pages/Error.page';
import LandingPage from './pages/Landing.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />
  },
  {
    path: 'register',
    element: <Register />
  },
  {
    path: 'devices',
    element: (
      <DevicesContextProvider>
        <ConsumptionPage />
      </DevicesContextProvider>
    ),
    children: [
      {
        path: ':deviceId',
        element: <ConsumptionPage />
      }
    ]
  }
]);

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    staleTime: 3600000,
    useErrorBoundary: false,
    retry: false
  }
});

const App: FC = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>((localStorage.getItem('colorScheme') as ColorScheme) ?? 'light');
  const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <AuthContextProvider>
            <OptionsContextProvider>
              <NotificationsProvider position="bottom-center">
                <RouterProvider router={router} />
              </NotificationsProvider>
            </OptionsContextProvider>
          </AuthContextProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
};

export default App;
