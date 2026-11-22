import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppModeProvider, useAppMode } from "@/contexts/AppModeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { StandaloneAuthProvider } from "@/contexts/StandaloneAuthContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { StandaloneSyncProvider } from "@/contexts/StandaloneSyncContext";
import { OrgProvider } from "@/contexts/OrgContext";
import { GuestBanner } from "@/components/GuestBanner";
import { AppShell } from "@/components/AppShell";
import { TeamMembers } from "@/components/TeamMembers";
import { PendingReviews } from "@/components/PendingReviews";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ModeSelection from "./pages/ModeSelection";
import { isKursEdition, isPublicPath, LEGACY_REDIRECTS } from "@/lib/edition";

// Öffentlicher Kursbereich: ohne Login, ohne Moduswahl (Spec: docs/specs/2026-11-22-kurs-auftritt.md)
const KursHome = lazy(() => import("./pages/kurs/KursHome"));
const KursModulPage = lazy(() => import("./pages/kurs/KursModulPage"));
const KursStand = lazy(() => import("./pages/kurs/KursStand"));
const KursGruppen = lazy(() => import("./pages/kurs/KursGruppen"));
const KursVorlagen = lazy(() => import("./pages/kurs/KursVorlagen"));
const KursProfi = lazy(() => import("./pages/kurs/KursProfi"));
const ErklaertIndex = lazy(() => import("./pages/kurs/Erklaert").then((m) => ({ default: m.ErklaertIndex })));
const ErklaertDetail = lazy(() => import("./pages/kurs/Erklaert").then((m) => ({ default: m.ErklaertDetail })));

const Playground = lazy(() => import("./pages/Playground"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminParticipants = lazy(() => import("./pages/AdminParticipants"));
const AdminFeedback = lazy(() => import("./pages/AdminFeedback"));
const FeedbackButton = lazy(() => import("./components/feedback/FeedbackButton"));

const queryClient = new QueryClient();

const PlatformLayout = ({ children }: { children: React.ReactNode }) => (
  <AppShell>
    <GuestBanner />
    {children}
  </AppShell>
);

const WorkshopApp = () => (
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
            <Route path="/admin/feedback" element={<PlatformLayout><AdminFeedback /></PlatformLayout>} />
            <Route path="/team" element={<PlatformLayout><TeamMembers /></PlatformLayout>} />
            <Route path="/reviews" element={<PlatformLayout><PendingReviews /></PlatformLayout>} />
            <Route path="/playground" element={<PlatformLayout><Playground /></PlatformLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FeedbackButton />
        </Suspense>
      </OrgProvider>
    </SyncProvider>
  </AuthProvider>
);

const StandaloneApp = () => (
  <StandaloneAuthProvider>
    <StandaloneSyncProvider>
      <OrgProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<PlatformLayout><Dashboard /></PlatformLayout>} />
            <Route path="/library" element={<PlatformLayout><Library /></PlatformLayout>} />
            <Route path="/onboarding" element={<PlatformLayout><Onboarding /></PlatformLayout>} />
            <Route path="/settings" element={<PlatformLayout><Settings /></PlatformLayout>} />
            <Route path="/admin/feedback" element={<PlatformLayout><AdminFeedback /></PlatformLayout>} />
            <Route path="/playground" element={<PlatformLayout><Playground /></PlatformLayout>} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FeedbackButton />
        </Suspense>
      </OrgProvider>
    </StandaloneSyncProvider>
  </StandaloneAuthProvider>
);

const PublicApp = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path="/kurs" element={<KursHome />} />
      <Route path="/kurs/stand" element={<KursStand />} />
      <Route path="/kurs/gruppen" element={<KursGruppen />} />
      <Route path="/kurs/vorlagen" element={<KursVorlagen />} />
      <Route path="/kurs/profi" element={<KursProfi />} />
      <Route path="/kurs/:id" element={<KursModulPage />} />
      <Route path="/erklaert" element={<ErklaertIndex />} />
      <Route path="/erklaert/:slug" element={<ErklaertDetail />} />
    </Routes>
  </Suspense>
);

const AppContent = () => {
  const { mode, isChosen } = useAppMode();
  const location = useLocation();

  const alt = LEGACY_REDIRECTS[location.pathname.replace(/\/$/, "")];
  if (alt) return <Navigate to={alt} replace />;
  if (isPublicPath(location.pathname)) return <PublicApp />;

  if (!isChosen) {
    // Kurs-Auftritt: Startseite ist die Kursübersicht, Moduswahl erst bei den Übungen
    if (isKursEdition() && location.pathname === "/") return <Navigate to="/kurs" replace />;
    return (
      <Routes>
        <Route path="*" element={<ModeSelection />} />
      </Routes>
    );
  }

  return mode === "workshop" ? <WorkshopApp /> : <StandaloneApp />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppModeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
