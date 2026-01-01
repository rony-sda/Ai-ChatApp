'use client'
import { SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import ChatMain from "@/module/chat/components/chat-main";
import ChatSidebar from "@/module/chat/components/chat-sidebar";



export default function Home() {
  const {data: session} = authClient.useSession()

  return (
     <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <div className="max-w-80 w-full overflow-hidden"><ChatSidebar session={session}/></div>
        <main className="flex-1">
          <ChatMain session={session} />
        </main>
      </div>
    </SidebarProvider>
  );
}
