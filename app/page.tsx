'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
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
import { ModeToggle } from '@/components/mode-toggle';
import { AlertCircle, RefreshCw, X, RotateCcw } from 'lucide-react';

const models = [
  { value: 'gpt-4o', name: 'GPT-4o' },
  { value: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { value: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
];

export default function HomePage() {
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');
  
  const { messages, sendMessage, error, clearError, setMessages } = useChat({
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  // Calculate user message count for demo limits
  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const maxMessages = 10; // Should match the API limit
  const remainingMessages = Math.max(0, maxMessages - userMessageCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setIsLoading(true);
      setLastUserMessage(input);
      clearError(); // Clear any previous errors
      try {
        await sendMessage({ text: input });
        setInput('');
      } catch (err) {
        console.error('Failed to send message:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getErrorMessage = (error: Error) => {
    if (error.message.includes('API key')) {
      return 'API key not configured. Please add your OpenAI API key to continue.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('rate limit')) {
      return 'Rate limit exceeded. Please wait a moment and try again.';
    }
    return error.message || 'An unexpected error occurred. Please try again.';
  };

  const handleNewSession = () => {
    setMessages([]);
    setInput('');
    setLastUserMessage('');
    clearError();
  };

  const handleRetry = async () => {
    if (lastUserMessage) {
      setIsLoading(true);
      clearError();
      try {
        await sendMessage({ text: lastUserMessage });
      } catch (err) {
        console.error('Failed to retry message:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">AI Chat Demo</h1>
            <p className="text-muted-foreground">Chat with AI using Vercel AI SDK and AI Elements</p>
            <div className="mt-1 text-sm text-muted-foreground">
              Demo Mode: {remainingMessages} messages remaining ({userMessageCount}/{maxMessages} used)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNewSession}
              disabled={isLoading}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              New Session
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>
      
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <h2 className="text-lg font-medium mb-2">Welcome to AI Chat</h2>
              <p>Start a conversation by typing a message below.</p>
              <p className="text-sm mt-2">
                🎯 Demo limits: {maxMessages} messages per session, {500} characters per message
              </p>
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

          {error && (
            <Message from="assistant">
              <MessageContent>
                        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                {getErrorMessage(error)}
              </p>
              <div className="flex gap-2">
                {lastUserMessage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                >
                  <X className="w-3 h-3 mr-1" />
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}
              </MessageContent>
            </Message>
          )}
        </div>
        
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((modelOption) => (
                    <SelectItem key={modelOption.value} value={modelOption.value}>
                      {modelOption.name}
                      {modelOption.value === 'gpt-4o' && ' (Demo: uses Mini)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {remainingMessages <= 2 && remainingMessages > 0 && (
                <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center">
                  ⚠️ {remainingMessages} messages left
                </div>
              )}
              
              {remainingMessages === 0 && (
                <div className="text-xs text-red-600 dark:text-red-400 flex items-center">
                  🚫 Demo limit reached - Start new session
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (error) clearError(); // Clear error when user starts typing
                }}
                className="flex-1 min-h-[60px]"
                maxLength={500} // Enforce character limit
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim() || remainingMessages <= 0}
                variant={error ? "destructive" : "default"}
              >
                Send
              </Button>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{input.length}/500 characters</span>
              <span>{remainingMessages} messages left</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
