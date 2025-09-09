'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const models = [
  { value: 'gpt-4o', name: 'GPT-4o' },
  { value: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { value: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
];

export default function Home() {
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [isLoading, setIsLoading] = useState(false);
  
  const { messages, sendMessage } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setIsLoading(true);
      try {
        await sendMessage({ text: input });
        setInput('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={25}
              priority
            />
            <div>
              <h1 className="text-xl font-bold">AI Chat Demo</h1>
              <p className="text-sm text-muted-foreground">Built with Vercel AI SDK & AI Elements</p>
            </div>
          </div>
          <ModeToggle />
        </div>
      </header>
      
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <h2 className="text-2xl font-medium mb-4">Welcome to AI Chat</h2>
              <p className="text-lg mb-2">Start a conversation with your AI assistant</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-2 py-1 rounded">
                  Vercel AI SDK
                </code>
                <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-2 py-1 rounded">
                  AI Elements
                </code>
                <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-2 py-1 rounded">
                  Next.js 15
                </code>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return part.text;
                  }
                  return '';
                }).join('')}
              </MessageContent>
            </Message>
          ))}
          
          {isLoading && (
            <Message from="assistant">
              <MessageContent>
                AI is thinking...
              </MessageContent>
            </Message>
          )}
        </div>
        
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 items-center">
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((modelOption) => (
                    <SelectItem key={modelOption.value} value={modelOption.value}>
                      {modelOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <a
                className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
                href="https://sdk.vercel.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                AI SDK Docs →
              </a>
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <footer className="border-t p-2">
        <div className="max-w-4xl mx-auto flex justify-center items-center gap-6 text-xs text-muted-foreground">
          <a
            className="hover:underline hover:underline-offset-4"
            href="https://sdk.vercel.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about AI SDK
          </a>
          <a
            className="hover:underline hover:underline-offset-4"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built with Next.js
          </a>
        </div>
      </footer>
    </div>
  );
}
