'use client'
import { SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import ChatMain from "@/module/home/components/chat-main";
import ChatSidebar from "@/module/home/components/chat-sidebar";


export default function Home() {
  const {data} = authClient.useSession()
  console.log(data)
  return (
     <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <div className="max-w-80 w-full overflow-hidden"><ChatSidebar /></div>
        <main className="flex-1">
          <ChatMain />
        </main>
      </div>
    </SidebarProvider>
  );
}
