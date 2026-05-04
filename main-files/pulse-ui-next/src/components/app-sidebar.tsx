"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  CircleUserRound,
  File,
  Gauge,
  LifeBuoyIcon,
  PieChart,
  SendIcon,
  ShoppingCart,
} from "lucide-react"

// nav menues
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/crm",
      isActive: true,
    },
    { title: "Product List", url: "/eCommerce/product-list" },
    { title: "Product Grid", url: "/eCommerce/product-grid" },
    { title: "Add Product", url: "/eCommerce/add-product" },
    { title: "Categories", url: "/eCommerce/categories" },
    {
      title: "Content Management",
      url: "/admin/news", 
    },
    { title: "About Us", url: "/admin/about" },
    { title: "Services", url: "/admin/services" },
    { title: "Blogs", url: "/admin/blogs" },
    { title: "News", url: "/admin/news" },
    {
      title: "Form Management",
      url: "/forms/form-layouts",
    },
    {
      title: "Account Settings",
      url: "/account/edit-profile",
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
    },
    {
      title: "Feedback",
      url: "#",
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="h-16 px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Pulse UI</span>
                  <span className="truncate text-xs">Next.js Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
