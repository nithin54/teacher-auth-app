import "@/lib/fetch-interceptor";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useGetMe } from "@workspace/api-client-react";

import { Layout } from "@/components/layout";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import Teachers from "@/pages/teachers";
import CreateTeacher from "@/pages/create-teacher";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const token = localStorage.getItem("auth_token");

  // Synchronous check to prevent flash of content
  if (!token) {
    setLocation("/login");
    return null;
  }

  // Server verification
  const { data: user, isLoading, isError } = useGetMe({
    query: { retry: false },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (isError || !user) {
    localStorage.removeItem("auth_token");
    setLocation("/login");
    return null;
  }

  return <Layout user={user}>{children}</Layout>;
}

function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-center p-8">
      <h1 className="text-6xl font-display font-bold text-slate-900 mb-4">404</h1>
      <p className="text-xl text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
      <a href={import.meta.env.BASE_URL} className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
        Return Home
      </a>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/teachers/create" component={CreateTeacher} />

      {/* Protected Routes */}
      <Route path="/">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/users">
        <ProtectedRoute><Users /></ProtectedRoute>
      </Route>
      <Route path="/teachers">
        <ProtectedRoute><Teachers /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster position="top-right" richColors closeButton theme="light" />
    </QueryClientProvider>
  );
}

export default App;
