import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC } from "react";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import { AuthContextProvider } from "./context/auth.context";
import LandingPage from "./pages/Landing.page";
import { AxiosError } from "axios";

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    staleTime: 43200000, // 12 hours
    useErrorBoundary: true,
    retry: (failureCount, error) =>
      (error as AxiosError)?.response?.status !== 403 && failureCount < 3,
  },
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AuthContextProvider>
          <LandingPage />
        </AuthContextProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
