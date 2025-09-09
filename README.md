# AI Chat Demo

A modern chatbot application built with **Vercel AI SDK** and **AI Elements** using Next.js 15, React 19, and Tailwind CSS.

## Features

- 🤖 Interactive AI chatbot interface
- 🎨 Modern UI with AI Elements components
- 🌙 Dark/Light mode support
- ⚙️ Multiple AI model selection (GPT-4o, GPT-4o Mini, GPT-3.5 Turbo)
- 📱 Responsive design
- ⚡ Real-time streaming responses
- 🎯 Built with TypeScript for type safety

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **React**: React 19
- **AI**: Vercel AI SDK & AI Elements
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **TypeScript**: Full type safety
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-chat-demo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. **Home Page**: The chat interface is available directly on the home page
2. **Chat Interface**: 
   - Select your preferred AI model from the dropdown
   - Type your message in the text area
   - Press Enter or click "Send" to chat with the AI
   - Use Shift+Enter for new lines in your message

## Project Structure

```
├── app/
│   ├── api/chat/route.ts          # Chat API endpoint
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page with chat interface
├── components/
│   ├── ai-elements/               # AI Elements components
│   ├── ui/                        # shadcn/ui components
│   ├── mode-toggle.tsx            # Dark/light mode toggle
│   └── theme-provider.tsx         # Theme provider
├── lib/
│   └── utils.ts                   # Utility functions
└── public/                        # Static assets
```

## Key Components

### API Route (`app/api/chat/route.ts`)
Handles chat requests using the Vercel AI SDK with OpenAI integration.

### Chat Page (`app/page.tsx`)
Main home page with integrated chat interface built with AI Elements components for a polished user experience.

### AI Elements Components Used
- `Message` & `MessageContent` - Chat message display
- `PromptInput` components - Input interface with model selection
- `Select` components - Model selection dropdown

## Available AI Models

- **GPT-4o**: Most capable model
- **GPT-4o Mini**: Balanced performance and cost
- **GPT-3.5 Turbo**: Fast and cost-effective

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Customization

### Adding New Models
Edit the `models` array in `app/chat/page.tsx`:

```typescript
const models = [
  { value: 'gpt-4o', name: 'GPT-4o' },
  { value: 'your-model', name: 'Your Model Name' },
];
```

### Styling
The app uses Tailwind CSS and shadcn/ui. Customize styles in:
- `app/globals.css` - Global styles
- Component files - Component-specific styles

### Environment Variables
- `OPENAI_API_KEY` - Your OpenAI API key (required)

## Deployment

Deploy easily on [Vercel](https://vercel.com):

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` in Vercel's environment variables
4. Deploy!

## Learn More

- [Vercel AI SDK Documentation](https://sdk.vercel.ai)
- [AI Elements Documentation](https://github.com/vercel/ai-elements)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## License

This project is open source and available under the [MIT License](LICENSE).
