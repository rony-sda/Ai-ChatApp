'use client';

import {
  HelpCircle,
  Gift,
  SendHorizontal,
  GraduationCap,
  Sparkles,
  ArrowBigRight,
  Code,
  Newspaper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useAIModels } from '@/module/ai-agent/hook';
import { useEffect, useState } from 'react';
import { ModelSelector } from './model-selector';
import { Spinner } from '@/components/ui/spinner';
import { useCreateChat } from '../hooks/chat';
import { toast } from 'sonner';
import { currentUserType } from '@/module/authentication/action';

const CHAT_TAB_MESSAGE = [
  {
    tabName: 'Create',
    icon: <Sparkles className="h-4 w-4" />,
    messages: [
      'Write a short story about a robot discovering emotions',
      'Help me outline a sci-fi novel set in a post-apocalyptic world',
      'Create a character profile for a complex villain with sympathetic motives',
      'Give me 5 creative writing prompts for flash fiction',
    ],
  },
  {
    tabName: 'Explore',
    icon: <Newspaper className="h-4 w-4" />,
    messages: [
      'Good books for fans of Rick Rubin',
      'Countries ranked by number of corgis',
      'Most successful companies in the world',
      'How much does Claude cost?',
    ],
  },
  {
    tabName: 'Code',
    icon: <Code className="h-4 w-4" />,
    messages: [
      'Write code to invert a binary search tree in Python',
      'What is the difference between Promise.all and Promise.allSettled?',
      "Explain React's useEffect cleanup function",
      'Best practices for error handling in async/await',
    ],
  },
  {
    tabName: 'Learn',
    icon: <GraduationCap className="h-4 w-4" />,
    messages: [
      "Beginner's guide to TypeScript",
      'Explain the CAP theorem in distributed systems',
      'Why is AI so expensive?',
      'Are black holes real?',
    ],
  },
];

interface iAppProps {
  user : currentUserType
}

export function ChatMain({ user }: iAppProps) {
  const { data: models, isPending } = useAIModels();
  const [selectedModel, setSelectedModel] = useState(models?.models[0]?.id);
  console.log(selectedModel)
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');

  const { mutateAsync, isPending: isChatPending } = useCreateChat();
  const router = useRouter();

  const handleMessageSelect = (messsage: string) => {
    setSelectedMessage(messsage);
  };

  const handleMessageChange = () => {
    setSelectedMessage('');
  };

  useEffect(() => {
    if (selectedMessage) {
      setMessage(selectedMessage);
      handleMessageChange?.();
    }
  }, [selectedMessage]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in'); // redirect to login page
        },
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if(!selectedModel) return toast.error("Please select a model")
      await mutateAsync({ content: message, model: selectedModel });
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/50 flex items-center justify-end px-6 bg-background/80 backdrop-blur-md z-10 gap-2">
        <Button variant="ghost" size="icon" className="size-9 rounded-full">
          <HelpCircle className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-9 rounded-full">
          <Gift className="size-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="size-8 ml-1">
              <AvatarImage src={user?.image || '/logo.png'} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <div className="flex items-center gap-2">
                <ArrowBigRight /> SignOut
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full">
        <div className="w-full max-w-2xl mb-12">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <Tabs defaultValue="Create">
              <TabsList>
                {CHAT_TAB_MESSAGE.map((tab, index) => (
                  <TabsTrigger
                    key={tab.tabName}
                    value={tab.tabName}
                    className="
          flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          data-[state=active]:bg-primary
          data-[state=active]:text-primary-foreground
          bg-muted/50 hover:bg-muted
        "
                  >
                    {tab.icon}
                    <span className="font-medium hidden md:block">{tab.tabName}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Prompt Suggestions List */}
              <div className="space-y-0 text-left">
                {CHAT_TAB_MESSAGE.map((prompt, i) => (
                  <TabsContent key={i} value={prompt.tabName}>
                    <div className="space-y-0 text-left">
                      {prompt.messages.map((message, j) => (
                        <button
                          key={j}
                          onClick={() => handleMessageSelect(message)}
                          className="w-full text-left py-4 px-2 text-foreground hover:text-foreground/45 transition-colors border-b border-[#2D2438] last:border-none group relative"
                        >
                          <p className="text-sm md:text-lg font-medium leading-relaxed group-hover:translate-x-1 transition-transform">
                            {message}
                          </p>
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="w-full max-w-3xl  pb-12">
        <form onSubmit={handleSubmit}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[28px] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <Card className="relative p-2 rounded-[24px] border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="px-4 pt-3 pb-1">
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Summarize the latest"
                    className="w-full bg-transparent border-none focus:ring-0 resize-none h-12 text-lg placeholder:text-muted-foreground/50 outline-none"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
  
                <div className="flex items-center justify-between px-2 pb-2 pt-1 border-t border-border/10">
                  <div className="flex items-center gap-1">
                    {isPending ? (
                      <>
                        <Spinner />
                      </>
                    ) : (
                      <>
                        <ModelSelector
                          models={models?.models}
                          selectedModelId={selectedModel}
                          onModelSelect={setSelectedModel}
                          className="ml-1"
                        />
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                   
                    <Button
                      disabled={!message.trim() || isChatPending}
                      size="icon"
                      type='submit'
                      className="size-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 shadow-lg"
                    >
                      {isChatPending ? (
                        <>
                          <Spinner />
                        </>
                      ) : (
                        <SendHorizontal className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
        </form>
          <p className="text-center text-[10px] text-muted-foreground/60 mt-4 font-medium tracking-wide">
           AI responses may be unavailable or inaccurate at times due to model limitations. Some models may not respond—please switch models and try again.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatMain;
