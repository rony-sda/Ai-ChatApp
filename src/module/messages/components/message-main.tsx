"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Fragment, useState, useEffect, useMemo, useRef } from "react";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";


import { Spinner } from "@/components/ui/spinner";
import { useSearchParams, useRouter } from "next/navigation";

import { RotateCcwIcon, StopCircleIcon } from "lucide-react";
import { useGetChatById } from "@/module/chat/hooks/chat";
import { useAIModels } from "@/module/ai-agent/hook";
import { useChatStore } from "@/module/chat/store/chat-store";
import { ModelSelector } from "@/module/chat/components/model-selector";

// Helper function to convert MessageRole enum to UIMessage role literal type
const convertMessageRole = (role: string): "user" | "assistant" | "system" => {
  const normalized = role.toUpperCase();
  if (normalized === "USER") return "user";
  if (normalized === "ASSISTANT") return "assistant";
  return "system"; // fallback, though unlikely
};

const MessageMain = ({ chatId } : { chatId: string }) => {
  const { data: models, isPending: isModelLoading } = useAIModels();
  const { data, isPending } = useGetChatById(chatId);
  const { hasChatBeenTriggered, markChatAsTriggered } = useChatStore();

  const [selectedModel, setSelectedModel] = useState(data?.data?.model);
  const [input, setInput] = useState("");


  const hasAutoTriggered = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";




  const initialMessages = useMemo((): UIMessage[] => {
    if (!data?.data?.messages) return [];

    return data.data.messages
      .filter((msg) => msg.content && msg.content.trim() !== "" && msg.id)
      .map((msg): UIMessage => {
        try {
          const parts = JSON.parse(msg.content);

          return {
            id: msg.id,
            role: convertMessageRole(msg.messageRole),
            parts: Array.isArray(parts)
              ? parts
              : [{ type: "text", text: msg.content }],
          };
        } catch (error) {
          return {
            id: msg.id,
            role: convertMessageRole(msg.messageRole),
            parts: [{ type: "text", text: msg.content }],
          };
        }
      });
  }, [data]);

  const { stop, messages, status, sendMessage, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });


  useEffect(() => {
    if (data?.data?.model && !selectedModel) {
      setSelectedModel(data.data.model);
    }
  }, [data, selectedModel]);

  useEffect(() => {
    if (hasAutoTriggered.current) return;
    if (!shouldAutoTrigger) return;
    if (hasChatBeenTriggered(chatId)) return;
    if (!selectedModel) return;
    if (initialMessages.length === 0) return;

    const lastMessage = initialMessages[initialMessages.length - 1];

    if (lastMessage.role !== "user") return;

    hasAutoTriggered.current = true;
    markChatAsTriggered(chatId);

    sendMessage(
      { text: "" },
      {
        body: {
          model: selectedModel,
          chatId,
          skipUserMessage: true,
        },
      }
    );

    router.replace(`/chat/${chatId}`);
  }, [
    shouldAutoTrigger,
    chatId,
    selectedModel,
    initialMessages,
    markChatAsTriggered,
    hasChatBeenTriggered,
    sendMessage,
    router,
  ]);


  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  const handleSubmit = () => {
    if (!input.trim()) return;

    sendMessage(
      { text: input },
      {
        body: {
          model: selectedModel,
          chatId,
        },
      }
    );

    setInput("");
  };

  const handleRetry = () => {
    regenerate();
  };

  const handleStop = () => {
    stop();
  };

  const messageToRender = [...initialMessages, ...messages];

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className={"h-full"}>
          <ConversationContent>
            {messageToRender.length === 0 ? (
              <>
                <div className="flex items-center justify-center h-full text-gray-500">
                  Start a conversation...
                </div>
              </>
            ) : (
              messageToRender.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Message
                            from={message.role}
                            key={`${message.id}-${i}`}
                          >
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                        );

                      case "reasoning":
                        return (
                          <Reasoning
                            className="max-w-2xl px-4 py-4 border border-muted rounded-md bg-muted/50"
                            key={`${message.id}-${i}`}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent className="mt-2 italic font-light text-muted-foreground">
                              {part.text}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      default:
                        return null;
                    }
                  })}
                </Fragment>
              ))
            )}
            {status === "streaming" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className={"mt-4"}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              // disabled={status === "" }
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools className={"flex items-center gap-2"}>
              {isModelLoading ? (
                <Spinner />
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              )}
              {status === "streaming" ? (
                <PromptInputButton onClick={handleStop}>
                  <StopCircleIcon size={16} />
                  <span>Stop</span>
                </PromptInputButton>
              ) : (
                messageToRender.length > 0 && (
                  <PromptInputButton onClick={handleRetry}>
                    <RotateCcwIcon size={16} />
                    <span>Retry</span>
                  </PromptInputButton>
                )
              )}
            </PromptInputTools>

            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default MessageMain;