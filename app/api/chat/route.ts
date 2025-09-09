import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limiter';

export const maxDuration = 30;

// Demo limits
const MAX_MESSAGES_PER_SESSION = 10; // Allow 10 messages per session
const MAX_MESSAGE_LENGTH = 500; // Limit message length to prevent abuse
const RATE_LIMIT_CONFIG = {
  maxRequests: 20, // 20 requests per hour per IP
  windowMs: 60 * 60 * 1000, // 1 hour
};

export async function POST(req: Request) {
  try {
    // Rate limiting by IP
    const clientId = getClientIdentifier(req);
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMIT_CONFIG);
    
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return new Response(
        JSON.stringify({ 
          error: `Rate limit exceeded. Try again after ${resetDate.toLocaleTimeString()}.` 
        }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          } 
        }
      );
    }

    const { messages, model }: { messages: UIMessage[]; model?: string } = await req.json();
    
    // Check message count limit
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length > MAX_MESSAGES_PER_SESSION) {
      return new Response(
        JSON.stringify({ 
          error: `Demo limit reached. You can send up to ${MAX_MESSAGES_PER_SESSION} messages per session. Please refresh to start a new session.` 
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check message length limit
    const lastUserMessage = userMessages[userMessages.length - 1];
    if (lastUserMessage?.parts?.some(part => part.type === 'text' && part.text && part.text.length > MAX_MESSAGE_LENGTH)) {
      return new Response(
        JSON.stringify({ 
          error: `Message too long. Please keep messages under ${MAX_MESSAGE_LENGTH} characters.` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Force cheaper model for demo
    const demoModel = model === 'gpt-4o' ? 'gpt-4o-mini' : (model || 'gpt-4o-mini');
    
    const result = streamText({
      model: openai(demoModel),
      messages: convertToModelMessages(messages),
      system: 'You are a helpful AI assistant. Be concise and helpful in your responses.',
    });
    
    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
