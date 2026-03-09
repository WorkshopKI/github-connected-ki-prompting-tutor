import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { SyncStatusIcon } from "@/components/SyncStatusIcon";
import { ThemePresetPicker } from "@/components/ThemePresetPicker";
import { useOrgContext } from "@/contexts/OrgContext";
import { useAppMode } from "@/contexts/AppModeContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Prompt Sammlung", icon: BookOpen, path: "/library" },
  { label: "Prompt Werkstatt", icon: Sparkles, path: "/playground" },
  { label: "Onboarding", icon: GraduationCap, path: "/onboarding" },
  { label: "Einstellungen", icon: Settings, path: "/settings" },
];

function getPageTitle(pathname: string): string {
  const all = navItems;
  const match = all.find((item) => item.path === pathname);
  if (match) return match.label;
  if (pathname === "/admin/teilnehmer") return "Teilnehmer-Verwaltung";
  return "Seite";
}

export const AppShell = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scopeLabel, isDepartment } = useOrgContext();
  const { isWorkshop } = useAppMode();

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 pt-5 pb-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <Logo size="sm" variant="sidebar" />
          </button>
          {isDepartment && (
            <div className="text-[10px] text-sidebar-foreground/50 mt-1 ml-0.5 truncate">
              {scopeLabel}
            </div>
          )}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive(item.path)}
                      tooltip={item.label}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <div className="flex items-center justify-between">
            <UserMenu />
            <div className="flex items-center gap-2">
              {isWorkshop && <SyncStatusIcon />}
              <ThemePresetPicker />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle(location.pathname)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
