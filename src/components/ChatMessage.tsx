// components/chat/ChatMessage.tsx
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import { Role } from '@/types/api';
import { BackendChatMessage } from '@/types/api';

const AiAvatar = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69a.75.75 0 01.981.981A10.501 10.501 0 0118 18a10.5 10.5 0 01-10.5-10.5c0-4.368 2.667-8.112 6.46-9.675a.75.75 0 01.818.162z" clipRule="evenodd" /><path fillRule="evenodd" d="M8.25 11.25a.75.75 0 01.75-.75h8.25a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
  </div>
);

const UserAvatar = ({ username }: { username: string }) => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#464646] font-semibold text-white">
    {username?.charAt(0).toUpperCase() || 'U'}
  </div>
);

export const ChatMessage: React.FC<{ message: BackendChatMessage, username: string }> = ({ message, username }) => {
  const isUser = message.role === Role.User;

  return (
    <div className={clsx('flex w-full items-start gap-4 py-4', { 'justify-end': isUser })}>
      {!isUser && <AiAvatar />}
      <div className="max-w-2xl">
        <div className={clsx(
          'rounded-xl px-4 py-3 text-gray-200',
          { 'rounded-br-none bg-[#343434]': isUser, 'rounded-bl-none bg-[#232323]': !isUser }
        )}>
          <article className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </article>
        </div>
      </div>
      {isUser && <UserAvatar username={username} />}
    </div>
  );
};