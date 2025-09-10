# AI Copilot Instructions

## Project Architecture

This is a **Next.js 15 AI chatbot demo** with **demo protection features** built using Vercel AI SDK and AI Elements. Uses shadcn/ui components, next-themes for dark mode, and Tailwind CSS v4. The project demonstrates modern AI chat patterns with streaming responses and comprehensive usage restrictions.

## Key Architecture: Demo Protection System

### Rate Limiting & Usage Controls (`lib/rate-limiter.ts`)
```typescript
// IP-based rate limiting with configurable windows
export function checkRateLimit(identifier: string, config: RateLimitConfig)

// Extract client IP from headers for identification
export function getClientIdentifier(request: Request): string
```

### Demo Limits Implementation (`app/api/chat/route.ts`)
```typescript
// Demo protection constants (update these to adjust limits)
const MAX_MESSAGES_PER_SESSION = 10;     // Per-session message limit
const MAX_MESSAGE_LENGTH = 500;          // Character limit per message
const RATE_LIMIT_CONFIG = {
  maxRequests: 20,                        // Requests per hour per IP
  windowMs: 60 * 60 * 1000,              // 1 hour window
};

// Force cheaper model regardless of selection
const demoModel = model === 'gpt-4o' ? 'gpt-4o-mini' : (model || 'gpt-4o-mini');
```

### Frontend Demo UX (`app/page.tsx`)
```typescript
// Session tracking and UI feedback
const userMessageCount = messages.filter(m => m.role === 'user').length;
const maxMessages = 10; // Must match API constant
const remainingMessages = Math.max(0, maxMessages - userMessageCount);

// Reset session functionality
const handleNewSession = () => {
  setMessages([]);        // Clear chat history
  setInput('');          // Clear input
  setLastUserMessage(''); // Clear retry state
  clearError();          // Clear errors
};
```

## AI SDK Integration Patterns

### useChat Hook with Demo Features
```tsx
const { messages, sendMessage, error, clearError, setMessages } = useChat({
  onError: (error) => console.error('Chat error:', error),
});

// Manual loading state (useChat status can be unreliable)
const [isLoading, setIsLoading] = useState(false);
```

### API Route Structure with Protection
```typescript
export const maxDuration = 30; // Required for Vercel streaming

export async function POST(req: Request) {
  // 1. Rate limiting check first
  const rateLimitResult = checkRateLimit(getClientIdentifier(req), RATE_LIMIT_CONFIG);
  
  // 2. Session message count validation
  const userMessages = messages.filter(m => m.role === 'user');
  if (userMessages.length > MAX_MESSAGES_PER_SESSION) { /* limit exceeded */ }
  
  // 3. Message length validation
  if (lastUserMessage?.parts?.some(part => part.text?.length > MAX_MESSAGE_LENGTH)) { /* too long */ }
  
  // 4. Force demo model and stream
  const result = streamText({
    model: openai(demoModel), // Always use cheaper model
    messages: convertToModelMessages(messages),
    system: 'You are a helpful AI assistant. Be concise and helpful in your responses.',
  });
  
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
```

### Message Rendering with Parts
```tsx
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

## Critical UI Patterns

### Demo Limits Display
```tsx
// Header with usage counter
<div className="mt-1 text-sm text-muted-foreground">
  Demo Mode: {remainingMessages} messages remaining ({userMessageCount}/{maxMessages} used)
</div>

// Form with character and message limits
<Textarea maxLength={500} /* ... */ />
<div className="flex justify-between text-xs text-muted-foreground">
  <span>{input.length}/500 characters</span>
  <span>{remainingMessages} messages left</span>
</div>

// Disabled state when limits reached
<Button disabled={isLoading || !input.trim() || remainingMessages <= 0}>
```

### Progressive Warning System
```tsx
{remainingMessages <= 2 && remainingMessages > 0 && (
  <div className="text-xs text-orange-600 dark:text-orange-400">
    ⚠️ {remainingMessages} messages left
  </div>
)}

{remainingMessages === 0 && (
  <div className="text-xs text-red-600 dark:text-red-400">
    🚫 Demo limit reached - Start new session
  </div>
)}
```

## Development Workflow

### Environment Setup
```bash
# Required environment variable
OPENAI_API_KEY=your_openai_api_key_here

# Development with Turbopack
pnpm dev

# Production build with Turbopack
pnpm build --turbopack
```

### AI Elements Components (`components/ai-elements/`)
- **Pre-built components** - Import from `@/components/ai-elements/`
- **Message system** - `Message` with `from="user|assistant"`, `MessageContent` wrapper
- **Styled consistently** - Follow existing patterns in `message.tsx`, `response.tsx`

### Styling System (Tailwind CSS v4)
```css
/* Global: app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* CSS variables with @theme inline configuration */
@theme inline {
  --color-background: var(--background);
  /* ... extensive color system ... */
}
```

## When Making Changes

1. **Demo limits**: Update constants in `app/api/chat/route.ts` AND matching values in `app/page.tsx`
2. **Rate limiting**: Adjust `RATE_LIMIT_CONFIG` for different IP-based restrictions
3. **New models**: Add to `models` array but remember `demoModel` logic forces cheaper options
4. **Error handling**: Use both `error` state and manual `isLoading` for reliable UX
5. **Client components**: Always use `"use client"` directive when using `useChat` hook
6. **Message parts**: Handle `text`, `reasoning`, and `source-url` part types in rendering
7. **Session reset**: Use `setMessages([])` to clear chat history, not just hiding UI

## Demo Protection Philosophy

This codebase prioritizes **user experience while protecting API costs**:
- **Transparent limits** - Users always know their remaining usage
- **Graceful degradation** - Warnings before hard stops
- **Easy recovery** - One-click session reset
- **Cost control** - Multiple overlapping protection layers
- **Production-ready** - Proper error handling and TypeScript types

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
