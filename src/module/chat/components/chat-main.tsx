'use client';

import {
  HelpCircle,
  Gift,
  Paperclip,
  Mic,
  Compass,
  SendHorizontal,
  GraduationCap,
  Code2,
  LayoutGrid,
  Sparkles,
  ArrowBigRight,
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
import { useState } from 'react';
import { ModelSelector } from './model-selector';
import { Spinner } from '@/components/ui/spinner';

export function ChatMain({ session }: { session: any }) {
  const { data: models, isPending } = useAIModels();
  const [selectedModel, setSelectedModel] = useState(models?.models[0]?.id);
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in'); // redirect to login page
        },
      },
    });
  };



  return (
    <div className="flex flex-col h-full">
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
              <AvatarImage src={session?.user?.image || '/logo.jpeg'} />
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
                <TabsTrigger
                  value="Create"
                  className="
        data-[state=active]:bg-primary
        data-[state=active]:text-primary-foreground
      "
                >
                  <Sparkles className="size-5 mr-2" />
                  <span className="font-bold text-base">Create</span>
                </TabsTrigger>
                <TabsTrigger
                  value="Explore"
                  className="
        data-[state=active]:bg-primary
        data-[state=active]:text-primary-foreground
      "
                >
                  <LayoutGrid className="size-5 mr-2" />
                  <span className="font-bold text-base">Explore</span>
                </TabsTrigger>
                <TabsTrigger
                  value="Code"
                  className="
        data-[state=active]:bg-primary
        data-[state=active]:text-primary-foreground
      "
                >
                  <Code2 className="size-5 mr-2" />
                  <span className="font-bold text-base">Code</span>
                </TabsTrigger>
                <TabsTrigger
                  value="Learn"
                  className="
        data-[state=active]:bg-primary
        data-[state=active]:text-primary-foreground
      "
                >
                  <GraduationCap className="size-5 mr-2" />
                  <span className="font-bold text-base">Learn</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Create">
                {/* Prompt Suggestions List */}
                <div className="space-y-0 text-left">
                  {[
                    'Write a short story about a robot discovering emotions',
                    'Help me outline a sci-fi novel set in a post-apocalyptic world',
                    'Create a character profile for a complex villain with sympathetic motives',
                    'Give me 5 creative writing prompts for flash fiction',
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      className="w-full text-left py-4 px-2 text-foreground hover:text-foreground/45 transition-colors border-b border-[#2D2438] last:border-none group relative"
                    >
                      <p className="text-lg font-medium leading-relaxed group-hover:translate-x-1 transition-transform">
                        {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="Explore">
                {/* Prompt Suggestions List */}
                <div className="space-y-0 text-left">
                  {[
                    'Write a short story about a robot discovering emotions',
                    'Help me outline a sci-fi novel set in a post-apocalyptic world',
                    'Create a character profile for a complex villain with sympathetic motives',
                    'Give me 5 creative writing prompts for flash fiction',
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      className="w-full text-left py-4 px-2 text-foreground hover:text-foreground/45 transition-colors border-b border-[#2D2438] last:border-none group relative"
                    >
                      <p className="text-lg font-medium leading-relaxed group-hover:translate-x-1 transition-transform">
                        {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="Code">
                {/* Prompt Suggestions List */}
                <div className="space-y-0 text-left">
                  {[
                    'Write a short story about a robot discovering emotions',
                    'Help me outline a sci-fi novel set in a post-apocalyptic world',
                    'Create a character profile for a complex villain with sympathetic motives',
                    'Give me 5 creative writing prompts for flash fiction',
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      className="w-full text-left py-4 px-2 text-foreground hover:text-foreground/45 transition-colors border-b border-[#2D2438] last:border-none group relative"
                    >
                      <p className="text-lg font-medium leading-relaxed group-hover:translate-x-1 transition-transform">
                        {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="Learn">
                {/* Prompt Suggestions List */}
                <div className="space-y-0 text-left">
                  {[
                    'Write a short story about a robot discovering emotions',
                    'Help me outline a sci-fi novel set in a post-apocalyptic world',
                    'Create a character profile for a complex villain with sympathetic motives',
                    'Give me 5 creative writing prompts for flash fiction',
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      className="w-full text-left py-4 px-2 text-foreground hover:text-foreground/45 transition-colors border-b border-[#2D2438] last:border-none group relative"
                    >
                      <p className="text-lg font-medium leading-relaxed group-hover:translate-x-1 transition-transform">
                        {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="w-full max-w-3xl  pb-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[28px] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <Card className="relative p-2 rounded-[24px] border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="px-4 pt-3 pb-1">
                <textarea
                  placeholder="Summarize the latest"
                  className="w-full bg-transparent border-none focus:ring-0 resize-none h-12 text-lg placeholder:text-muted-foreground/50 outline-none"
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
                  <span className="text-[10px] font-mono text-muted-foreground/60">
                    20 / 3,000
                  </span>
                  <Button
                    size="icon"
                    className="size-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 shadow-lg"
                  >
                    <SendHorizontal className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/60 mt-4 font-medium tracking-wide">
            Ai-Chat may generate inaccurate information about people, places, or
            facts. Model: Open Router
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatMain;
