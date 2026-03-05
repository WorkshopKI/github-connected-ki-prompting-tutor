import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { GuestBanner } from "@/components/GuestBanner";
import { AppShell } from "@/components/AppShell";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Onboarding from "./pages/Onboarding";
import Workspace from "./pages/Workspace";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminParticipants from "./pages/AdminParticipants";
import Playground from "./pages/Playground";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PlatformLayout = ({ children }: { children: React.ReactNode }) => (
  <AppShell>
    <GuestBanner />
    {children}
  </AppShell>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SyncProvider>
            <Routes>
              <Route path="/" element={<PlatformLayout><Dashboard /></PlatformLayout>} />
              <Route path="/library" element={<PlatformLayout><Library /></PlatformLayout>} />
              <Route path="/onboarding" element={<PlatformLayout><Onboarding /></PlatformLayout>} />
              <Route path="/workspace" element={<PlatformLayout><Workspace /></PlatformLayout>} />
              <Route path="/analytics" element={<PlatformLayout><Analytics /></PlatformLayout>} />
              <Route path="/settings" element={<PlatformLayout><Settings /></PlatformLayout>} />
              <Route path="/profil" element={<PlatformLayout><Profile /></PlatformLayout>} />
              <Route path="/admin/teilnehmer" element={<PlatformLayout><AdminParticipants /></PlatformLayout>} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/login" element={<Login />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SyncProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
