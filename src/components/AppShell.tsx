import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { useOrgContext } from "@/contexts/OrgContext";
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
  { label: "Onboarding", icon: GraduationCap, path: "/onboarding" },
  { label: "Prompt Sammlung", icon: BookOpen, path: "/library" },
  { label: "Prompt Werkstatt", icon: Sparkles, path: "/playground" },
];

function getPageTitle(pathname: string): string {
  const match = navItems.find((item) => item.path === pathname);
  if (match) return match.label;
  if (pathname === "/settings") return "Einstellungen";
  if (pathname === "/admin/teilnehmer") return "Teilnehmer-Verwaltung";
  if (pathname === "/team") return "Team";
  if (pathname === "/reviews") return "Reviews";
  return "Seite";
}

export const AppShell = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scopeLabel, isDepartment } = useOrgContext();

  const isPlayground = location.pathname === "/playground";
  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider defaultOpen={!isPlayground}>
      <Sidebar collapsible="icon" data-feedback-ref="navigation.sidebar" data-feedback-label="Sidebar">
        <SidebarHeader className="flex-row pl-4 pr-4 items-center h-14 border-b border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <Logo size="sm" variant="sidebar" className="translate-y-[2px]" />
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
        </SidebarContent>

        <SidebarFooter className="p-2">
          <UserMenu scopeLabel={isDepartment ? scopeLabel : undefined} />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {!isPlayground && (
          <header className="flex h-14 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">{getPageTitle(location.pathname)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
        )}
        <div className={isPlayground ? "flex-1 min-h-0" : "flex-1 p-4 md:p-6 lg:p-8 max-w-7xl"}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
