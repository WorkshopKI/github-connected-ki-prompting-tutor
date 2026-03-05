import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { SyncStatusIcon } from "@/components/SyncStatusIcon";
import { ThemePresetPicker } from "@/components/ThemePresetPicker";
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
  SidebarSeparator,
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
  { label: "Onboarding", icon: GraduationCap, path: "/onboarding" },
  { label: "Prompt Library", icon: BookOpen, path: "/library" },
  { label: "Team Workspace", icon: Users, path: "/workspace" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
];

const secondaryItems = [
  { label: "Prompt-Labor", icon: Sparkles, path: "/playground" },
];

function getPageTitle(pathname: string): string {
  const all = [...navItems, ...secondaryItems];
  const match = all.find((item) => item.path === pathname);
  if (match) return match.label;
  if (pathname === "/settings") return "Einstellungen";
  if (pathname === "/profil") return "Profil";
  if (pathname === "/admin/teilnehmer") return "Teilnehmer-Verwaltung";
  return "Seite";
}

export const AppShell = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <Logo size="sm" />
          </button>
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

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryItems.map((item) => (
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
            <div className="flex items-center gap-1">
              <SyncStatusIcon />
              <ThemePresetPicker />
              <button
                onClick={() => navigate("/settings")}
                className={`inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ${
                  isActive("/settings") ? "text-foreground bg-accent" : ""
                }`}
                title="Einstellungen"
              >
                <Settings className="h-4 w-4" />
              </button>
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
