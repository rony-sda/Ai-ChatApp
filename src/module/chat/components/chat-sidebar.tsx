'use client';

import {
  Search,
  Plus,
  Clock,
  MessageSquare,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  EllipsisIcon,
  Trash,
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { useMemo, useState } from 'react';
import { useChatStore } from '../store/chat-store';
import { getAllChatsType } from '../action';
import Link from 'next/link';
import { useDeleteChat } from '../hooks/chat';
import { toast } from 'sonner';
import { currentUserType } from '@/module/authentication/action';
import { useRouter } from 'next/navigation';

interface iAppsProps {
  user: currentUserType;
  chats: getAllChatsType['data'] | [];
}

function ChatSidebar({ user, chats }: iAppsProps) {
  const { theme, setTheme } = useTheme();
  const { activeChatId , setActiveChatId} = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { mutateAsync, isPending } = useDeleteChat();
  const router = useRouter()

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chats;
    }

    const query = searchQuery.toLocaleLowerCase();

    return chats?.filter(
      chat =>
        chat.title?.toLowerCase().includes(query) ||
        chat.messages?.some(msg => msg.content?.toLowerCase().includes(query))
    );
  }, [chats, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const onDelete = async (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await mutateAsync(chatId);
    if (res.success) toast.success('Chat deleted successfully');
  };

  const handleNewChat = () => {
 router.push('/')
 setActiveChatId(null)
  }

  if (theme === undefined) return null;
  return (
    <Sidebar
      variant="inset"
      className="border-r border-border/50 w-80  bg-background"
    >
      <SidebarHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg flex items-center justify-center gap-2">
            <Image src={'/logo.png'} alt="Logo" width={40} height={40} />
            <span className="font-bold text-xl tracking-tight text-foreground">
              Ai ChatApp
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-4 mb-4 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-background"
          />
        </div>

        <div className="px-4 mb-6">
          <Button
            onClick={handleNewChat}
            className={`w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-foreground border-none h-10 shadow-none cursor-pointer`}
          >
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
              {filteredChats?.length === 0 ? (
                <div className="px-2 py-5 text-center text-sm text-muted-foreground">
                  No chats yet
                </div>
              ) : (
                filteredChats?.map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton className={` ${
                          activeChatId === item.id ? 'text-foreground bg-primary' : ''
                        } px-2 py-5 rounded-lg group`}>
                      <Link
                        href={`/chat/${item.id}`}
                        className={`flex items-center justify-between w-full`}
                      >
                        <div className="flex flex-1 items-center gap-2">
                          <MessageSquare className={`size-4 text-muted-foreground group-hover:text-foreground`} />
                          <span className="truncate text-sm font-medium">
                            {item.title.slice(0, 20)}...
                          </span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 group-hover:opacity-100 hover:bg-sidebar-accent-foreground/10"
                              onClick={e => e.preventDefault()}
                            >
                              <EllipsisIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center">
                            <DropdownMenuItem
                              className="flex flex-row gap-2 cursor-pointer"
                              onClick={e => onDelete(e, item?.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                              <span className="text-red-500">
                                {isPending ? 'Deleting...' : 'Delete'}
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
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
            className={`${
              theme === 'light' ? 'bg-primary' : 'bg-muted'
            } flex-1 gap-2 h-8 rounded-lg shadow-none`}
            onClick={() => setTheme('light')}
          >
            <Sun className="size-3.5" />
            Light
          </Button>
          <Button
            size="sm"
            className={`${
              theme === 'dark' ? 'bg-primary' : 'bg-muted'
            } flex-1 gap-2 h-8 rounded-lg shadow-none`}
            onClick={() => setTheme('dark')}
          >
            <Moon className="size-3.5" />
            Dark
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="size-10 rounded-full border-2 border-background ring-1 ring-border">
            <AvatarImage src={user?.image || '/logo.png'} />
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate">
              {user?.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
export default ChatSidebar;
