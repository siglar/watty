import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC } from 'react';
import './App.css';
import { MantineProvider } from '@mantine/core';
import { AuthContextProvider } from './context/auth.context';
import LandingPage from './pages/Landing.page';
import { AxiosError } from 'axios';
import { OptionsContextProvider } from './context/options.context';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    staleTime: Infinity,
    useErrorBoundary: true,
    retry: (failureCount, error) => (error as AxiosError)?.response?.status !== 403 && failureCount < 3
  }
});

const App: FC = () => {
  return (
    <GoogleOAuthProvider clientId="951883528295-vv987gtdrdg55ga3lf6hpjoelf1v2tau.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AuthContextProvider>
            <OptionsContextProvider>
              <LandingPage />
            </OptionsContextProvider>
          </AuthContextProvider>
        </MantineProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
