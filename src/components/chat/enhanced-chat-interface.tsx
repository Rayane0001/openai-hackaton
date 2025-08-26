// @file src/components/chat/enhanced-chat-interface.tsx
// Optimized chat interface with personality-specific interactions

'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage, AIPersonality } from '@/lib/types';

interface EnhancedChatInterfaceProps {
  scenarioId: string;
  personality: AIPersonality;
  initialMessage?: string;
  onSendMessage?: (message: string) => Promise<string>;
}

const PERSONALITY_CHAT_CONFIG = {
  optimistic: {
    name: 'The Visionary',
    avatar: '🌟',
    color: 'from-yellow-400 to-orange-400',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    welcomeMessage: "Hey there! I'm so excited to share what I've learned from living this path. The future turned out even better than we hoped! What would you like to know?",
    suggestedQuestions: [
      "What was the best thing that happened?",
      "How did you overcome the challenges?", 
      "What would you do differently?",
      "How do you feel about the decision now?"
    ],
    tone: 'enthusiastic'
  },
  realistic: {
    name: 'The Balanced',
    avatar: '⚖️',
    color: 'from-blue-400 to-indigo-400',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    welcomeMessage: "Hello! I've lived through this decision and learned a lot along the way. It had its ups and downs, but overall I can give you a balanced perspective. What specific aspects are you curious about?",
    suggestedQuestions: [
      "What were the main trade-offs?",
      "How did it affect your relationships?",
      "What surprised you most?",
      "Would you recommend this path?"
    ],
    tone: 'balanced'
  },
  cautious: {
    name: 'The Sage',
    avatar: '🛡️',
    color: 'from-green-400 to-emerald-400',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    welcomeMessage: "Greetings. I chose the safer path, and I want to share what I learned about security and stability. There's wisdom in caution, but also lessons about missed opportunities. What would you like to discuss?",
    suggestedQuestions: [
      "What risks did you avoid?",
      "Do you have any regrets?",
      "How secure do you feel now?",
      "What advice would you give?"
    ],
    tone: 'thoughtful'
  },
  adventurous: {
    name: 'The Explorer',
    avatar: '🚀',
    color: 'from-purple-400 to-pink-400',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    welcomeMessage: "What's up! I took the bold leap and wow, what a ride it's been! Sure, there were some wild moments, but the growth and experiences... totally worth it. Ready to hear about this adventure?",
    suggestedQuestions: [
      "What was the biggest risk you took?",
      "How did you handle the uncertainty?",
      "What amazing things happened?",
      "Any epic failures turned successes?"
    ],
    tone: 'energetic'
  }
};

export default function EnhancedChatInterface({ 
  scenarioId, 
  personality, 
  initialMessage,
  onSendMessage 
}: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const config = PERSONALITY_CHAT_CONFIG[personality];

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: initialMessage || config.welcomeMessage,
      timestamp: new Date(),
      scenarioId,
      futureAge: 35 // Default future age
    };
    setMessages([welcomeMsg]);
  }, [scenarioId, personality, initialMessage, config.welcomeMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      scenarioId,
      futureAge: 35
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setShowSuggestions(false);
    setIsTyping(true);

    try {
      const response = await onSendMessage?.(messageText) || 'Thanks for your question! I understand what you\'re going through.';
      
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          scenarioId,
          futureAge: 35
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500); // Simulate thinking time

    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(currentMessage);
    }
  };

  return (
    <div className={`flex flex-col h-full max-h-[600px] rounded-xl border-2 border-gray-200 ${config.bgColor}`}>
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 bg-gradient-to-r ${config.color} text-white rounded-t-xl`}>
        <div className="flex items-center gap-3">
          <div className="text-2xl bg-white/20 rounded-full p-2">
            {config.avatar}
          </div>
          <div>
            <h3 className="font-bold text-lg">{config.name}</h3>
            <p className="text-sm text-white/90">Your future self from this timeline</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-white/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white ml-4'
                  : 'bg-white border border-gray-200 text-gray-800 mr-4'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{config.avatar}</span>
                  <span className="text-xs text-gray-500 font-medium">{config.name}</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-800 max-w-[80%] p-3 rounded-lg mr-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{config.avatar}</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {showSuggestions && (
        <div className="p-3 border-t border-gray-200 bg-white/70">
          <div className="text-xs text-gray-600 mb-2">💡 Ask me about:</div>
          <div className="flex flex-wrap gap-2">
            {config.suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:border-purple-400 hover:bg-purple-50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex gap-3">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${config.name} anything...`}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none h-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSendMessage(currentMessage)}
            disabled={!currentMessage.trim() || isTyping}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentMessage.trim() && !isTyping
                ? `bg-gradient-to-r ${config.color} text-white hover:shadow-md`
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}