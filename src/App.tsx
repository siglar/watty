import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';
import { LoadingOverlay, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { FC } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/auth.context';
import { OptionsContextProvider } from './context/options.context';
import { Notifications } from '@mantine/notifications';
const ConsumptionPage = React.lazy(() => import('./pages/Consumption.page'));
const LandingPage = React.lazy(() => import('./pages/Landing.page'));
const ErrorPage = React.lazy(() => import('./pages/Error.page'));
const Register = React.lazy(() => import('./components/LogIn/Register/Register'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <React.Suspense fallback={<LoadingOverlay visible overlayProps={{ blur: 1 }} />}>
        <LandingPage />
      </React.Suspense>
    ),
    errorElement: (
      <React.Suspense fallback={<LoadingOverlay visible overlayProps={{ blur: 1 }} />}>
        <ErrorPage />
      </React.Suspense>
    )
  },
  {
    path: 'register',
    element: (
      <React.Suspense fallback={<LoadingOverlay visible overlayProps={{ blur: 1 }} />}>
        <Register />
      </React.Suspense>
    )
  },
  {
    path: 'devices',
    element: (
      <React.Suspense fallback={<LoadingOverlay visible overlayProps={{ blur: 1 }} />}>
        <ConsumptionPage />
      </React.Suspense>
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
    retry: false
  }
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications position={'bottom-center'} autoClose={10000} />
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
