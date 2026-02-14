import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Edge from "./pages/Edge";
import Tools from "./pages/Tools";
import Speaking from "./pages/Speaking";
import WhatIDo from "./pages/WhatIDo";
import HowIWork from "./pages/HowIWork";
import Experience from "./pages/Experience";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import EvaluateRoom from "./pages/EvaluateRoom";
import DecisionSimulation from "./pages/DecisionSimulation";
import RedTeamSimulation from "./pages/RedTeamSimulation";
import { usePageTracking } from "./hooks/usePageTracking";
import { GlobalClickTracker } from "./components/GlobalClickTracker";
import { SessionRecorder } from "./components/SessionRecorder";
import { HashRedirectHandler } from "./components/HashRedirectHandler";

const queryClient = new QueryClient();

function AppRoutes() {
  usePageTracking();
  
  return (
    <>
      <HashRedirectHandler />
      <GlobalClickTracker />
      <SessionRecorder />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edge" element={<Edge />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/what-i-do" element={<WhatIDo />} />
        <Route path="/how-i-work" element={<HowIWork />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/executive-cv" element={<Resume />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tools/evaluate" element={<EvaluateRoom />} />
        <Route path="/tools/evaluate/decision" element={<DecisionSimulation />} />
        <Route path="/tools/evaluate/redteam" element={<RedTeamSimulation />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
