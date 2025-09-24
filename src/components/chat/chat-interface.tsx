// @file src/components/chat/chat-interface.tsx
// Main chat interface for talking with future selves

'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, Scenario, AIPersonality } from '@/lib/types';
import MessageBubble from './message-bubble';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  scenario: Scenario;
  userId?: string;
  onMessageSent?: (message: string) => void;
}

export default function ChatInterface({ scenario, userId, onMessageSent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = generateWelcomeMessage(scenario);
    setMessages([welcomeMessage]);
  }, [scenario]);

  const generateWelcomeMessage = (scenario: Scenario): ChatMessage => {
    const futureAge = 35; // Calculate based on user age + scenario years

    const welcomeTexts = {
      optimistic: `Hey there! 🌟 I'm your future self from the ${scenario.personality} timeline. Life has been absolutely amazing since you made that decision! I'm ${futureAge} now and I have so much to share about how everything worked out beautifully.`,
      realistic: `Hi! ⚖️ I'm you from the realistic future scenario. I'm ${futureAge} and I've got a balanced perspective on how that decision played out. There were ups and downs, but overall it was a solid choice.`,
      cautious: `Hello 🛡️ I'm your future self from the cautious path. At ${futureAge}, I can tell you that playing it safe had its benefits. I took the conservative approach and while there were fewer risks, there were also some missed opportunities.`,
      adventurous: `What's up! 🚀 I'm the adventurous version of your future self. Life at ${futureAge} has been one wild ride since you took that bold leap! Sure, there were some bumps, but the experiences have been incredible.`
    };

    return {
      id: `welcome_${Date.now()}`,
      role: 'assistant',
      content: welcomeTexts[scenario.personality],
      timestamp: new Date(),
      scenarioId: scenario.id,
      futureAge: futureAge
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      scenarioId: scenario.id,
      futureAge: 0
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    onMessageSent?.(inputMessage.trim());

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      const response = await fetch(`/api/chat/${scenario.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage.trim(),
          userId: userId,
          messageHistory: messages
        })
      });

      if (response.ok) {
        const { message: aiResponse } = await response.json();

        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
          scenarioId: scenario.id,
          futureAge: 35 // Calculate based on scenario
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Fallback response
        const fallbackResponse = generateFallbackResponse(inputMessage, scenario.personality);
        setMessages(prev => [...prev, fallbackResponse]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = generateErrorResponse(scenario.personality);
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (userInput: string, personality: AIPersonality): ChatMessage => {
    const responses = {
      optimistic: "That's a great question! In my timeline, everything worked out even better than expected. The key was staying positive and seeing opportunities everywhere!",
      realistic: "I understand what you're asking. From my experience, it's important to consider both the positives and negatives. Let me give you a balanced perspective...",
      cautious: "That's something I thought about a lot too. I chose the safer route, which meant fewer risks but also fewer dramatic changes. It was the right choice for stability.",
      adventurous: "Oh, that reminds me of when I took that huge leap! It was scary but so worth it. Sometimes you just have to trust your gut and go for it!"
    };

    return {
      id: `fallback_${Date.now()}`,
      role: 'assistant',
      content: responses[personality],
      timestamp: new Date(),
      scenarioId: scenario.id,
      futureAge: 35
    };
  };

  const generateErrorResponse = (personality: AIPersonality): ChatMessage => {
    return {
      id: `error_${Date.now()}`,
      role: 'assistant',
      content: "Sorry, I'm having trouble connecting right now. But I'm here and ready to share my perspective when you are!",
      timestamp: new Date(),
      scenarioId: scenario.id,
      futureAge: 35
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How did you feel right after making this decision?",
    "What was the biggest challenge you faced?",
    "If you could go back, would you change anything?",
    "What advice would you give me right now?",
    "What surprised you most about this path?"
  ];

  return (
      <div className="flex flex-col h-full">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              🔮
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Chat with Future Self</h3>
              <p className="text-sm text-gray-600">
                {scenario.personality.charAt(0).toUpperCase() + scenario.personality.slice(1)} timeline • {scenario.probability}% probability
              </p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
              <MessageBubble
                  key={message.id}
                  message={message}
                  futurePersonality={scenario.personality}
              />
          ))}

          {isTyping && (
              <MessageBubble
                  message={{} as ChatMessage}
                  futurePersonality={scenario.personality}
                  isTyping={true}
              />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 2 && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                      <button
                          key={index}
                          onClick={() => setInputMessage(question)}
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                      >
                        {question}
                      </button>
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <div className="flex-1">
            <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your future self anything..."
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            </div>
            <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                loading={isLoading}
                className="self-end"
            >
              Send
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
  );
}