"use client"


import { Search, Plus, Clock, MessageSquare, Settings, HelpCircle, Sun, Moon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useTheme } from "next-themes"


 function ChatSidebar () {

  const { theme, setTheme } = useTheme()

 if(theme === undefined) return null
 
  return (
    <Sidebar variant="inset" className="border-r border-border/50 w-80  bg-background">
      <SidebarHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg flex items-center justify-center gap-2">
           <Image src={'/logo.jpeg'} alt="Logo" width={40} height={40}/>
          <span className="font-bold text-xl tracking-tight text-foreground">Ai ChatApp</span>
        </div>
         </div>
     
      </SidebarHeader>

      <SidebarContent>
        <div className="px-4 mb-4 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-background" />
         
        </div>

        <div className="px-4 mb-6">
          <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-foreground border-none h-10 shadow-none">
            <Plus className="size-4" />
            New Chat
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Clock className="size-3" />
            Chat History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {[
                "Marketing Copy for SaaS",
                "Python Script Debugging",
                "Product Strategy Sync",
                "Holiday Trip Planning",
                "Research on Quantum Computing",
              ].map((item, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton className="px-2 py-5 rounded-lg group">
                    <MessageSquare className="size-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="truncate text-sm font-medium">{item}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 pb-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
            Settings & Help
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="gap-2">
                <Settings className="size-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="gap-2">
                <HelpCircle className="size-4" />
                <span>Help</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl mb-6">
          <Button
            
            size="sm"
             className={`${theme === "light" ? "bg-primary" : "bg-muted"} flex-1 gap-2 h-8 rounded-lg shadow-none`}
            onClick={() => setTheme("light")}
          >
            <Sun className="size-3.5" />
            Light
          </Button>
          <Button
           
            size="sm"
            className={`${theme === "dark" ? "bg-primary" : "bg-muted"} flex-1 gap-2 h-8 rounded-lg shadow-none`}
            onClick={() => setTheme("dark")}
          >
            <Moon className="size-3.5" />
            Dark
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="size-10 rounded-full border-2 border-background ring-1 ring-border">
            <AvatarImage src="/logo.jpeg" />
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate">Emilia Caitlin</span>
            <span className="text-xs text-muted-foreground truncate">hey@unspace.agency</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
export default ChatSidebar