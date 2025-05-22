"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { handleChat } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Bot, User, Send, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string; // For potential image rendering in chat
  timestamp: Date;
}

const chatFormSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

export default function ChatPageClient() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = async (data: ChatFormValues) => {
    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: data.message,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    form.reset();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    const formData = new FormData();
    formData.append("message", data.message);
    // Send only last N messages for history context to avoid overly large payloads
    const historyToSend = messages.slice(-5).map(msg => ({role: msg.role, content: msg.content}));
    formData.append("conversationHistory", JSON.stringify(historyToSend));


    const result = await handleChat(formData);
    setIsLoading(false);

    if (result.success && result.response) {
      const assistantMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } else {
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: result.error || "Failed to get a response from the chatbot.",
      });
      // Optional: re-add user message to input if submission failed server-side after optimistic update
      // form.setValue("message", data.message);
      // setMessages(prev => prev.filter(m => m.id !== userMessage.id)); 
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Bot className="mr-2 h-7 w-7 text-primary" /> Adult Chatbot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarFallback>
                      <Bot className="text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-xl p-3 shadow",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  {msg.imageUrl && (
                     <Image src={msg.imageUrl} alt="Chat image" width={300} height={300} className="mt-2 rounded-md" data-ai-hint="chat image" />
                  )}
                  <p className={cn("text-xs mt-1", msg.role === "user" ? "text-primary-foreground/70 text-right" : "text-secondary-foreground/70")}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {msg.role === "user" && (
                  <Avatar className="h-10 w-10 border-2 border-accent">
                     <AvatarFallback>
                      <User className="text-accent" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarFallback>
                    <Bot className="text-primary animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] rounded-xl p-3 shadow bg-secondary text-secondary-foreground">
                  <p className="text-sm italic">Assistant is typing...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start space-x-3">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here..."
                      className="resize-none min-h-[60px] max-h-[150px] text-base"
                      {...field}
                      ref={textareaRef}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" disabled={isLoading} className="h-[60px] aspect-square p-0">
              {isLoading ? (
                <CornerDownLeft className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
