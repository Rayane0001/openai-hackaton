// @file src/app/api/chat/[scenario]/route.ts
// API route for chatting with future self

import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage, AIPersonality } from '@/lib/types';
import { callGptOss } from '@/lib/gpt-oss';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ scenario: string }> }
) {
  try {
    const { message, messageHistory } = await request.json();
    const { scenario: scenarioId } = await params;

    console.log('🚀 Chat request for scenario:', scenarioId);

    // Get scenario details
    const scenario = await getScenario(scenarioId);
    if (!scenario) {
      return NextResponse.json(
          { success: false, error: 'Scenario not found' },
          { status: 404 }
      );
    }

    // Generate AI response using GPT-OSS with fallback
    const aiResponse = await generateAIResponseWithGptOss(
        message,
        scenario.personality,
        messageHistory,
        scenario
    );

    return NextResponse.json({
      success: true,
      message: aiResponse.message,
      reasoning: aiResponse.reasoning, // New: transparent reasoning!
      scenarioId: scenarioId,
      futureAge: scenario.futureAge
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
        { success: false, error: 'Failed to process chat message' },
        { status: 500 }
    );
  }
}

async function getScenario(scenarioId: string) {
  // Mock scenario data - replace with real database lookup
  const mockScenarios: Record<string, { id: string; personality: AIPersonality; title: string; futureAge: number; context: string }> = {
    'scenario_1': {
      id: 'scenario_1',
      personality: 'optimistic' as AIPersonality,
      title: 'Best Case: Accept Remote Job Offer',
      futureAge: 35,
      context: 'Remote job transition went extremely well'
    },
    'scenario_2': {
      id: 'scenario_2',
      personality: 'realistic' as AIPersonality,
      title: 'Realistic: Accept Remote Job Offer',
      futureAge: 35,
      context: 'Remote job had normal ups and downs'
    },
    'test_scenario': {
      id: 'test_scenario',
      personality: 'realistic' as AIPersonality,
      title: 'GPT-OSS Integration Test',
      futureAge: 30,
      context: 'Testing GPT-OSS transparent reasoning integration'
    }
  };

  return mockScenarios[scenarioId] || null;
}

async function generateAIResponseWithGptOss(
    userMessage: string,
    personality: AIPersonality,
    messageHistory: ChatMessage[],
    scenario: { id: string; personality: AIPersonality; title: string; futureAge: number; context: string }
): Promise<{ message: string; reasoning: string }> {

  // Build context from conversation history
  const conversationContext = buildConversationContext(messageHistory, scenario);
  
  // Create the prompt for GPT-OSS
  const prompt = `${conversationContext}

Current message from your past self: "${userMessage}"

Remember, you are their future self at age ${scenario.futureAge} from the ${personality} timeline: "${scenario.title}"
Context of your timeline: ${scenario.context}

Respond as this future self would, sharing your lived experience and wisdom from having gone through this journey.`;

  console.log('🧠 Calling GPT-OSS for personality:', personality);

  // Try GPT-OSS first
  const gptResponse = await callGptOss(prompt, personality, 'medium', 'chat');
  
  if (gptResponse) {
    console.log('✅ GPT-OSS response received');
    return {
      message: gptResponse.message,
      reasoning: gptResponse.reasoning
    };
  }

  // Fallback to enhanced mock responses
  console.log('🔄 Falling back to enhanced mock responses');
  const mockResponse = generateEnhancedMockResponse(userMessage, personality, scenario);
  return {
    message: mockResponse,
    reasoning: `Mock reasoning: Selected ${personality} response based on message analysis and personality traits.`
  };
}

function buildConversationContext(messageHistory: ChatMessage[], _scenario: { id: string; personality: AIPersonality; title: string; futureAge: number; context: string }): string {
  if (!messageHistory || messageHistory.length === 0) {
    return `This is your first conversation with your past self.`;
  }

  // Get last 3-4 messages for context without overwhelming the model
  const recentMessages = messageHistory.slice(-4);
  const contextLines = recentMessages.map(msg => 
    `${msg.role === 'user' ? 'Past self' : 'You (future self)'}: ${msg.content}`
  ).join('\n');

  return `Previous conversation context:
${contextLines}

Continue this conversation naturally.`;
}

function generateEnhancedMockResponse(
    userMessage: string,
    personality: AIPersonality,
    scenario: { id: string; personality: AIPersonality; title: string; futureAge: number; context: string }
): string {
  // Enhanced mock responses that feel more personal and contextual
  const responses = generatePersonalityResponses(userMessage, personality, scenario);
  const keywords = userMessage.toLowerCase();

  // More sophisticated keyword analysis
  if (keywords.includes('feel') || keywords.includes('emotion') || keywords.includes('scared') || keywords.includes('anxious')) {
    return responses.emotional;
  } else if (keywords.includes('advice') || keywords.includes('should') || keywords.includes('recommend') || keywords.includes('what would you')) {
    return responses.advice;
  } else if (keywords.includes('challenge') || keywords.includes('difficult') || keywords.includes('hard') || keywords.includes('struggle')) {
    return responses.challenges;
  } else if (keywords.includes('regret') || keywords.includes('different') || keywords.includes('wish') || keywords.includes('mistake')) {
    return responses.regrets;
  } else if (keywords.includes('surprise') || keywords.includes('unexpected') || keywords.includes('didn\'t expect')) {
    return responses.surprises;
  } else if (keywords.includes('how') || keywords.includes('what') || keywords.includes('when') || keywords.includes('where')) {
    return responses.specific;
  } else {
    return responses.general;
  }
}

function generatePersonalityResponses(_userMessage: string, personality: AIPersonality, scenario: { id: string; personality: AIPersonality; title: string; futureAge: number; context: string }) {
  const baseAge = scenario.futureAge;

  const responseTemplates = {
    optimistic: {
      emotional: `Oh, I felt absolutely incredible! 🌟 At ${baseAge}, I can look back and say that decision was one of the best things that ever happened to me. The initial excitement never really wore off - it just transformed into this deep satisfaction and confidence.`,
      advice: `My advice? Go for it! Trust me, I've lived it and it's amazing. Don't let fear hold you back. The universe has a way of supporting bold decisions, and this one will open so many doors you can't even imagine right now.`,
      challenges: `You know what? Even the challenges turned out to be blessings in disguise! Sure, there were some adjustments, but each obstacle taught me something valuable and made me stronger. Looking back, I'm grateful for every bump in the road.`,
      regrets: `Regrets? Absolutely not! If anything, I wish I had made this decision sooner. Every day I wake up grateful for the path we chose. Life has been such an adventure since then.`,
      surprises: `The biggest surprise was how much better everything turned out than I even hoped! I thought I was being optimistic back then, but reality exceeded my wildest dreams. The opportunities that came up were beyond what I could have imagined.`,
      specific: `Let me tell you exactly how it played out... It was ${Math.floor((baseAge - 28) / 2)} years ago when everything started clicking into place. The timeline went better than we could have ever planned!`,
      general: `Life has been absolutely wonderful since that decision! I'm ${baseAge} now and I can honestly say every day feels like a gift. The path we chose led to so many amazing experiences and opportunities.`
    },
    realistic: {
      emotional: `Honestly? It was a mix of emotions. Initially excited, then a bit anxious during the transition, but ultimately satisfied. At ${baseAge}, I can say it was the right choice, even though it wasn't always easy.`,
      advice: `My advice is to be prepared for both the good and the challenging parts. It's not going to be perfect, but it's definitely worth it. Set realistic expectations and be ready to adapt when things don't go exactly as planned.`,
      challenges: `There were definitely some real challenges. The adjustment period was tougher than expected, and there were moments of doubt. But with persistence and flexibility, we worked through them. Not everything was smooth, but it was manageable.`,
      regrets: `I wouldn't say regrets, but there are a few things I'd handle differently. Maybe I'd prepare better for certain challenges or communicate more clearly with people involved. Overall though, it was still the right choice.`,
      surprises: `The biggest surprise was how much personal growth came from it. I expected certain outcomes, but I didn't anticipate how much the experience would change me as a person. Both the successes and setbacks taught me things I never would have learned otherwise.`,
      specific: `Here's how it actually unfolded: Year 1 was adjustment, year 3 was when things stabilized, and by year ${Math.min(5, baseAge - 28)} we hit our stride. It's been a balanced journey with predictable ups and downs.`,
      general: `It's been a solid journey. At ${baseAge}, I can look back and say it was a good decision. There were ups and downs, but that's life, right? The important thing is that we moved forward and learned along the way.`
    },
    cautious: {
      emotional: `I was really nervous at first, to be honest. Even now at ${baseAge}, I sometimes wonder 'what if' about other paths. But I feel secure knowing I chose the safer route. There's peace of mind in stability.`,
      advice: `Be very careful and think it through thoroughly. Consider all the risks and have backup plans. I took the conservative approach and while it meant fewer dramatic highs, it also meant fewer scary lows. Safety has its own rewards.`,
      challenges: `The challenges were manageable because I prepared for them extensively. I may have missed some opportunities by being too cautious, but I avoided some major pitfalls too. It's about finding that balance between safety and growth.`,
      regrets: `Sometimes I wonder if I played it too safe. There were opportunities I didn't take because they seemed too risky. But then again, I avoided some real disasters that way. It's hard to know what the 'right' level of risk is.`,
      surprises: `I was surprised by how much security and peace of mind mattered to me. I thought I might feel like I was missing out, but actually, the stability allowed me to focus on other important things in life.`,
      specific: `I took the methodical approach: 6 months of planning, backup options ready, and gradual implementation. It took longer but felt much safer. By year ${Math.min(3, baseAge - 28)}, I was glad I played it safe.`,
      general: `Life has been steady and secure since that decision. At ${baseAge}, I appreciate the stability it brought. Maybe it wasn't the most exciting path, but it was reliable and that has its own value.`
    },
    adventurous: {
      emotional: `It was exhilarating! 🚀 The rush of taking that leap was incredible. Sure, there were moments of panic and doubt, but the excitement and sense of possibility made it all worthwhile. At ${baseAge}, I still get energized thinking about it.`,
      advice: `Take the leap! Life is short and you'll regret the chances you didn't take more than the ones you did. Yes, it's scary, but that's what makes it exciting. Trust yourself - you're more capable than you think.`,
      challenges: `Oh, there were some wild challenges! A few times I thought 'what have I done?' But each obstacle became an adventure in itself. Problem-solving on the fly, adapting quickly - it all made me so much more resilient and confident.`,
      regrets: `My only regret is not taking even bigger risks! Looking back, I could have been even bolder. But I'm proud that I had the courage to take the leap when others were playing it safe.`,
      surprises: `The biggest surprise was discovering capabilities I never knew I had. When you're pushed out of your comfort zone, you find out what you're really made of. I surprised myself with how adaptable and resourceful I could be.`,
      specific: `I jumped in with both feet! Month 1 was chaos, month 6 was breakthrough, year 2 was when everything started paying off. The timeline was faster and more intense than anyone expected - pure adrenaline!`,
      general: `What a ride it's been! At ${baseAge}, I can say this decision led to the most exciting and fulfilling years of my life. Sure, it was chaotic at times, but I wouldn't trade this adventure for anything.`
    }
  };

  return responseTemplates[personality];
}