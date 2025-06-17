import { auth } from "@/@shared/lib/better-auth/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/view/components/ui/sidebar";
import { LogoutForm } from "@/view/forms/logout.form";
import { UserIcon, Users2Icon, UsersIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAdmin = session?.user.role === "admin";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-2xl font-black">
          <span>BWS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenu>
              {/* <SidebarMenuItem>
                <SidebarMenuButton>
                  <ArrowLeftRightIcon />
                  <span>Migrações</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/users">
                    <Users2Icon />
                    <span>Usuários</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>WWT</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/wwt/clients">
                  <UserIcon />
                  <span>Clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* <SidebarMenuItem>
              <SidebarMenuButton>
                <SmartphoneIcon />
                <span>Dispositivos</span>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>BWFleets</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/bwfleets">
                  <UsersIcon />
                  <span>Meus clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* <SidebarMenuItem>
              <SidebarMenuButton>
                <SmartphoneIcon />
                <span>Dispositivos</span>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <LogoutForm />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
