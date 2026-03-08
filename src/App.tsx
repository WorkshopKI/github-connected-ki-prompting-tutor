import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { OrgProvider } from "@/contexts/OrgContext";
import { GuestBanner } from "@/components/GuestBanner";
import { AppShell } from "@/components/AppShell";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const Playground = lazy(() => import("./pages/Playground"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminParticipants = lazy(() => import("./pages/AdminParticipants"));

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
          <OrgProvider>
            <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<PlatformLayout><Dashboard /></PlatformLayout>} />
              <Route path="/library" element={<PlatformLayout><Library /></PlatformLayout>} />
              <Route path="/onboarding" element={<PlatformLayout><Onboarding /></PlatformLayout>} />
              <Route path="/workspace" element={<Navigate to="/library" replace />} />
              <Route path="/analytics" element={<Navigate to="/" replace />} />
              <Route path="/settings" element={<PlatformLayout><Settings /></PlatformLayout>} />
              <Route path="/profil" element={<Navigate to="/settings" replace />} />
              <Route path="/admin/teilnehmer" element={<PlatformLayout><AdminParticipants /></PlatformLayout>} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/login" element={<Login />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </OrgProvider>
          </SyncProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
