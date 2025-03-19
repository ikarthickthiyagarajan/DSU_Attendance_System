"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Calendar, LayoutDashboard, LogOut, Users, FileBarChart, Bell, User, Settings, Moon, Sun } from "lucide-react"
import { clearSession, useAuthGuard } from "@/lib/auth"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const { theme, setTheme } = useTheme()

  // Use auth guard to protect dashboard routes
  useAuthGuard(true)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background futuristic-bg">
        <Sidebar variant="inset">
          <SidebarHeader className="flex items-center justify-center py-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mb-2 glow">
                DSU
              </div>
              <h2 className="text-xl font-bold gradient-text">Attendance System</h2>
            </motion.div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <a href="/dashboard" className="transition-all duration-300 hover:bg-primary/10 group">
                    <LayoutDashboard className="group-hover:text-primary transition-colors duration-300" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/students"}>
                  <a href="/dashboard/students" className="transition-all duration-300 hover:bg-primary/10 group">
                    <Users className="group-hover:text-primary transition-colors duration-300" />
                    <span>Students</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/attendance"}>
                  <a href="/dashboard/attendance" className="transition-all duration-300 hover:bg-primary/10 group">
                    <Calendar className="group-hover:text-primary transition-colors duration-300" />
                    <span>Attendance</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/reports"}>
                  <a href="/dashboard/reports" className="transition-all duration-300 hover:bg-primary/10 group">
                    <FileBarChart className="group-hover:text-primary transition-colors duration-300" />
                    <span>Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start transition-all duration-300 hover:bg-primary/10 group"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4 group-hover:text-primary transition-colors duration-300" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4 group-hover:text-primary transition-colors duration-300" />
                  Dark Mode
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400 group"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4 group-hover:text-red-500 transition-colors duration-300" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex h-full flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-lg">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                        3
                      </Badge>
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 glassmorphism">
                    <div className="flex items-center justify-between p-2 border-b border-border/30">
                      <span className="font-medium">Notifications</span>
                      <Button variant="ghost" size="sm">
                        Mark all as read
                      </Button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <DropdownMenuItem key={i} className="p-3 cursor-pointer hover:bg-primary/10">
                          <div className="flex gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">New student registered</p>
                              <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <div className="p-2 border-t border-border/30 text-center">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          AD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glassmorphism">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">Admin</p>
                        <p className="text-xs text-muted-foreground">adeepanneer@gmail.com</p>
                      </div>
                    </div>
                    <DropdownMenuItem className="hover:bg-primary/10">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-primary/10">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500 dark:text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6 grid-bg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

