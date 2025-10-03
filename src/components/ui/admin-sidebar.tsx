"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  DollarSign,
  Mail,
  Phone,
  Calendar,
  Shield,
  LogOut
} from "lucide-react";
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  SidebarOverlay,
} from "./sidebar";
import { useUserRole } from "@/hooks/useUserRole";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Requests",
    url: "/admin/requests",
    icon: FileText,
  },
  {
    title: "Contact Submissions",
    url: "/admin/contacts",
    icon: Mail,
  },
  {
    title: "Projects",
    url: "/admin/projects",
    icon: BarChart3,
  },
  {
    title: "Invoices",
    url: "/admin/invoices",
    icon: DollarSign,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const clientMenuItems = [
  {
    title: "Client Dashboard",
    url: "/app",
    icon: BarChart3,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { role } = useUserRole();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Sidebar className="relative">
      <SidebarRail />
      <SidebarOverlay />
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">ARPK Admin</span>
              <span className="text-xs text-muted-foreground">Management Panel</span>
            </div>
          </div>
          <SidebarTrigger className="lg:hidden" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <div className="relative">
                      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-primary" />}
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="w-full"
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Client Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clientMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="w-full"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 rounded-lg border border-sidebar-border bg-sidebar/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs">
                <div className="font-medium">Administrator</div>
                <div className="text-muted-foreground">Full access</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs border border-border hover:bg-accent"
            >
              <LogOut className="h-3 w-3" />
              Sign out
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
