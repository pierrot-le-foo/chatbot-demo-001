# AI Copilot Instructions

## Project Architecture

This is a Next.js 15 AI chatbot application built with Vercel AI SDK and AI Elements. Uses shadcn/ui components, next-themes for dark mode, and Tailwind CSS v4. The project demonstrates modern AI chat patterns with streaming responses.

## AI SDK Integration Patterns

### useChat Hook Usage
```tsx
// Basic pattern from app/page.tsx
const { messages, sendMessage } = useChat();

// Key properties available:
// - messages: UIMessage[] - Chat message history
// - sendMessage: ({ text: string }) => void - Send user message
// - status: 'ready' | 'submitted' | 'streaming' | 'error' - Current state
// - error: Error | undefined - Error state
// - stop: () => void - Stop streaming
// - regenerate: () => void - Regenerate last response
```

### API Route Structure (`app/api/chat/route.ts`)
```typescript
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 30; // Required for Vercel deployment

export async function POST(req: Request) {
  const { messages, model } = await req.json();
  
  const result = streamText({
    model: openai(model || 'gpt-4o-mini'),
    messages: convertToModelMessages(messages), // Convert UIMessage[] to ModelMessage[]
    system: 'Your system prompt here',
  });
  
  return result.toUIMessageStreamResponse({
    sendSources: true,    // Enable source citations
    sendReasoning: true,  // Enable reasoning tokens
  });
}
```

### Message Handling Patterns
```tsx
// Render messages with parts (text, reasoning, sources)
{messages.map((message) => (
  <Message key={message.id} from={message.role}>
    <MessageContent>
      {message.parts.map((part, index) => {
        if (part.type === 'text') return part.text;
        if (part.type === 'reasoning') return `[Reasoning: ${part.text}]`;
        if (part.type === 'source-url') return `[Source: ${part.url}]`;
        return '';
      }).join('')}
    </MessageContent>
  </Message>
))}
```

## AI Elements Components

### Message Components
- `Message` with `from="user|assistant"` prop
- `MessageContent` for text content
- `Response` wrapper for assistant messages

### Advanced Components Available
- `Reasoning` - Collapsible reasoning display
- `Sources` - Citation management
- `Tool` - Tool execution results
- `CodeBlock` - Syntax highlighted code
- `PromptInput` - Advanced input with model selection

## Key Patterns & Conventions

### Component Structure
- **AI Elements** in `components/ai-elements/` - Pre-built AI UX components
- **shadcn/ui components** in `components/ui/` - Generated using `npx shadcn@latest add [component]`
- **Client components** require `"use client"` directive for AI hooks

### Styling System
- **Tailwind CSS v4** with `@theme inline` configuration
- **CSS variables** for theming (--background, --foreground, --primary, etc.)
- **Dark mode** with `class` strategy via next-themes

### Import Patterns
```tsx
// AI SDK imports
import { useChat } from '@ai-sdk/react';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

// AI Elements imports
import { Message, MessageContent } from '@/components/ai-elements/message';
import { PromptInput } from '@/components/ai-elements/prompt-input';

// Standard imports
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

## Development Workflow

### Dependencies
```bash
pnpm install  # Uses pnpm package manager
```

### Environment Setup
```bash
# Required: Create .env.local with OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

### Development Server
```bash
pnpm dev  # Uses Turbopack for faster builds
```

### Add Components
```bash
npx shadcn@latest add [component-name]  # UI components
npx ai-elements@latest                  # AI Elements (already installed)
```

## Critical Implementation Details

### Model Selection Pattern
```tsx
const models = [
  { value: 'gpt-4o', name: 'GPT-4o' },
  { value: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { value: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
];
```

### Loading State Management
```tsx
// Manual loading state (since useChat status can be unreliable)
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  setIsLoading(true);
  try {
    await sendMessage({ text: input });
  } finally {
    setIsLoading(false);
  }
};
```

### Form Handling
```tsx
// Enter to submit, Shift+Enter for new line
onKeyDown={(e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(e);
  }
}}
```

## When Making Changes

1. **AI functionality**: Always use `convertToModelMessages()` in API routes
2. **New chat features**: Use AI Elements components for consistent UX
3. **Message rendering**: Handle different part types (text, reasoning, sources)
4. **Client components**: Add `"use client"` for useChat hook usage
5. **Environment**: Ensure `OPENAI_API_KEY` is set for testing
6. **API routes**: Set `maxDuration = 30` for streaming endpoints
