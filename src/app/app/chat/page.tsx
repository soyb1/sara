import ChatPageClient from '@/components/chat/chat-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SARA - Chat',
  description: 'Engage in adult conversations with our AI chatbot.',
};

export default function ChatPage() {
  return (
    <div className="w-full">
      <ChatPageClient />
    </div>
  );
}
