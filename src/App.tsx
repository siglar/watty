import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC } from 'react';
import './App.css';
import { MantineProvider } from '@mantine/core';
import { AuthContextProvider } from './context/auth.context';
import LandingPage from './pages/Landing.page';
import { AxiosError } from 'axios';
import { OptionsContextProvider } from './context/options.context';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/Error.page';
import ConsumptionPage from './pages/Consumption.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />
  },
  {
    path: 'devices/:deviceId',
    element: <ConsumptionPage />
  }
]);

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    staleTime: Infinity,
    useErrorBoundary: false,
    retry: (failureCount, error) => (error as AxiosError)?.response?.status !== 403 && failureCount <= 3
  }
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AuthContextProvider>
          <OptionsContextProvider>
            <RouterProvider router={router} />
          </OptionsContextProvider>
        </AuthContextProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
