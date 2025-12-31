"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { Loader2 } from "lucide-react";

import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

const SignIn = () => {
  const [googleLoading, startGoogleTransition,] = useTransition()
  const [githubLoading, startGitHubTransition,] = useTransition()

  const signInWithGoogle = () => {
      startGoogleTransition(async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Singed in with Google, you will be redirected...") 
        },
        onError: (error) => {
          toast.error(error.error.message)
        }
      }
    });
    })
    };
    
      const signInWithGitHub = () => {
      startGitHubTransition(async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Singed in with Github, you will be redirected...") 
        },
        onError: (error) => {
          toast.error(error.error.message)
          console.log(error)
        }
      }
    });
    })
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-16 md:py-32">
      <div className="flex flex-row justify-center items-center gap-x-2">
        <h1 className="text-3xl font-extrabold text-foreground">Welcome to Ai-ChatApp</h1>
       
      </div>

			<p className="mt-2 text-lg text-muted-foreground font-semibold">
				  Sign in below (Sign in to continue chatting with AI 🤖)
			</p>

           <Button
			variant={"default"}
			className={
				   "max-w-sm mt-5 w-full px-7 py-7 flex flex-row justify-center items-center cursor-pointer"
			}
			onClick={signInWithGoogle}
			>
                 {googleLoading ? <><Loader2 className="size-4 animate-spin" /> Loading...</> : <>
                 <Image src={"/google.svg"} alt="Github" width={24} height={24}/>
				<span className="font-bold ml-2">
					Sign in with Google
				</span>
                 </>
				}
			</Button>
			<Button
			variant={"default"}
			className={
				   "max-w-sm mt-5 w-full px-7 py-7 flex flex-row justify-center items-center cursor-pointer"
			}
			onClick={signInWithGitHub}
			>
                {githubLoading ? <><Loader2 className="size-4 animate-spin" /> Loading...</> : <>
                <Image src={"/github.svg"} alt="Github" width={24} height={24}/>
				<span className="font-bold ml-2">
					Sign in with Github
				</span>
                 </>
				} 
				
			</Button>

    </section>
  );
};

export default SignIn;