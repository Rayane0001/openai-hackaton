// @file src/components/chat/message-bubble.tsx
// Message bubble component for chat interface

'use client';

import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
  futurePersonality?: 'optimistic' | 'realistic' | 'cautious' | 'adventurous';
  isTyping?: boolean;
}

const personalityStyles = {
  optimistic: { bg: 'bg-green-500', name: 'Optimistic You', icon: '🌟' },
  realistic: { bg: 'bg-blue-500', name: 'Realistic You', icon: '⚖️' },
  cautious: { bg: 'bg-yellow-500', name: 'Cautious You', icon: '🛡️' },
  adventurous: { bg: 'bg-purple-500', name: 'Adventurous You', icon: '🚀' }
};

export default function MessageBubble({
                                        message,
                                        futurePersonality = 'realistic',
                                        isTyping = false
                                      }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const style = personalityStyles[futurePersonality];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (isTyping) {
    return (
        <div className="flex items-start space-x-3 mb-4">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-sm", style.bg)}>
            {style.icon}
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {style.name} is thinking...
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className={cn(
          "flex items-start space-x-3 mb-4",
          isUser && "flex-row-reverse space-x-reverse"
      )}>
        {/* Avatar */}
        <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
            isUser ? "bg-gray-600" : style.bg
        )}>
          {isUser ? 'You' : style.icon}
        </div>

        {/* Message content */}
        <div className="flex-1 max-w-xs lg:max-w-md">
          <div className={cn(
              "rounded-lg px-4 py-3 shadow-sm",
              isUser
                  ? "bg-purple-600 text-white ml-auto"
                  : "bg-white border border-gray-200 text-gray-900"
          )}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>

          {/* Timestamp and future age */}
          <div className={cn(
              "flex items-center mt-1 text-xs text-gray-500 space-x-2",
              isUser && "justify-end"
          )}>
            <span>{formatTime(message.timestamp)}</span>
            {!isUser && (
                <>
                  <span>•</span>
                  <span>Age {message.futureAge}</span>
                  <span>•</span>
                  <span className="text-purple-600 font-medium">{style.name}</span>
                </>
            )}
          </div>
        </div>
      </div>
  );
}