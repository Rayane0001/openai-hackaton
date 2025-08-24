// @file src/app/api/chat/[scenario]/route.ts
// API route for chatting with future self

import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage, AIPersonality } from '@/lib/types';

export async function POST(
    request: NextRequest,
    { params }: { params: { scenario: string } }
) {
  try {
    const { message, userId, messageHistory } = await request.json();
    const scenarioId = params.scenario;

    console.log('Chat request for scenario:', scenarioId);

    // Get scenario details (mock for now)
    const scenario = await getScenario(scenarioId);
    if (!scenario) {
      return NextResponse.json(
          { success: false, error: 'Scenario not found' },
          { status: 404 }
      );
    }

    // Generate AI response based on personality and message history
    const response = await generateAIResponse(
        message,
        scenario.personality,
        messageHistory,
        scenario
    );

    return NextResponse.json({
      success: true,
      message: response,
      scenarioId: scenarioId
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
  const mockScenarios: Record<string, any> = {
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
    }
  };

  return mockScenarios[scenarioId] || null;
}

async function generateAIResponse(
    userMessage: string,
    personality: AIPersonality,
    messageHistory: ChatMessage[],
    scenario: any
): Promise<string> {

  // Mock response generation - replace with real gpt-oss integration
  const responses = generatePersonalityResponses(userMessage, personality, scenario);

  // Simple keyword-based response selection (replace with proper AI)
  const keywords = userMessage.toLowerCase();

  if (keywords.includes('feel') || keywords.includes('emotion')) {
    return responses.emotional;
  } else if (keywords.includes('advice') || keywords.includes('should')) {
    return responses.advice;
  } else if (keywords.includes('challenge') || keywords.includes('difficult')) {
    return responses.challenges;
  } else if (keywords.includes('regret') || keywords.includes('different')) {
    return responses.regrets;
  } else if (keywords.includes('surprise') || keywords.includes('unexpected')) {
    return responses.surprises;
  } else {
    return responses.general;
  }
}

function generatePersonalityResponses(userMessage: string, personality: AIPersonality, scenario: any) {
  const baseAge = scenario.futureAge;

  const responseTemplates = {
    optimistic: {
      emotional: `Oh, I felt absolutely incredible! 🌟 At ${baseAge}, I can look back and say that decision was one of the best things that ever happened to me. The initial excitement never really wore off - it just transformed into this deep satisfaction and confidence.`,
      advice: `My advice? Go for it! Trust me, I've lived it and it's amazing. Don't let fear hold you back. The universe has a way of supporting bold decisions, and this one will open so many doors you can't even imagine right now.`,
      challenges: `You know what? Even the challenges turned out to be blessings in disguise! Sure, there were some adjustments, but each obstacle taught me something valuable and made me stronger. Looking back, I'm grateful for every bump in the road.`,
      regrets: `Regrets? Absolutely not! If anything, I wish I had made this decision sooner. Every day I wake up grateful for the path we chose. Life has been such an adventure since then.`,
      surprises: `The biggest surprise was how much better everything turned out than I even hoped! I thought I was being optimistic back then, but reality exceeded my wildest dreams. The opportunities that came up were beyond what I could have imagined.`,
      general: `Life has been absolutely wonderful since that decision! I'm ${baseAge} now and I can honestly say every day feels like a gift. The path we chose led to so many amazing experiences and opportunities.`
    },
    realistic: {
      emotional: `Honestly? It was a mix of emotions. Initially excited, then a bit anxious during the transition, but ultimately satisfied. At ${baseAge}, I can say it was the right choice, even though it wasn't always easy.`,
      advice: `My advice is to be prepared for both the good and the challenging parts. It's not going to be perfect, but it's definitely worth it. Set realistic expectations and be ready to adapt when things don't go exactly as planned.`,
      challenges: `There were definitely some real challenges. The adjustment period was tougher than expected, and there were moments of doubt. But with persistence and flexibility, we worked through them. Not everything was smooth, but it was manageable.`,
      regrets: `I wouldn't say regrets, but there are a few things I'd handle differently. Maybe I'd prepare better for certain challenges or communicate more clearly with people involved. Overall though, it was still the right choice.`,
      surprises: `The biggest surprise was how much personal growth came from it. I expected certain outcomes, but I didn't anticipate how much the experience would change me as a person. Both the successes and setbacks taught me things I never would have learned otherwise.`,
      general: `It's been a solid journey. At ${baseAge}, I can look back and say it was a good decision. There were ups and downs, but that's life, right? The important thing is that we moved forward and learned along the way.`
    },
    cautious: {
      emotional: `I was really nervous at first, to be honest. Even now at ${baseAge}, I sometimes wonder 'what if' about other paths. But I feel secure knowing I chose the safer route. There's peace of mind in stability.`,
      advice: `Be very careful and think it through thoroughly. Consider all the risks and have backup plans. I took the conservative approach and while it meant fewer dramatic highs, it also meant fewer scary lows. Safety has its own rewards.`,
      challenges: `The challenges were manageable because I prepared for them extensively. I may have missed some opportunities by being too cautious, but I avoided some major pitfalls too. It's about finding that balance between safety and growth.`,
      regrets: `Sometimes I wonder if I played it too safe. There were opportunities I didn't take because they seemed too risky. But then again, I avoided some real disasters that way. It's hard to know what the 'right' level of risk is.`,
      surprises: `I was surprised by how much security and peace of mind mattered to me. I thought I might feel like I was missing out, but actually, the stability allowed me to focus on other important things in life.`,
      general: `Life has been steady and secure since that decision. At ${baseAge}, I appreciate the stability it brought. Maybe it wasn't the most exciting path, but it was reliable and that has its own value.`
    },
    adventurous: {
      emotional: `It was exhilarating! 🚀 The rush of taking that leap was incredible. Sure, there were moments of panic and doubt, but the excitement and sense of possibility made it all worthwhile. At ${baseAge}, I still get energized thinking about it.`,
      advice: `Take the leap! Life is short and you'll regret the chances you didn't take more than the ones you did. Yes, it's scary, but that's what makes it exciting. Trust yourself - you're more capable than you think.`,
      challenges: `Oh, there were some wild challenges! A few times I thought 'what have I done?' But each obstacle became an adventure in itself. Problem-solving on the fly, adapting quickly - it all made me so much more resilient and confident.`,
      regrets: `My only regret is not taking even bigger risks! Looking back, I could have been even bolder. But I'm proud that I had the courage to take the leap when others were playing it safe.`,
      surprises: `The biggest surprise was discovering capabilities I never knew I had. When you're pushed out of your comfort zone, you find out what you're really made of. I surprised myself with how adaptable and resourceful I could be.`,
      general: `What a ride it's been! At ${baseAge}, I can say this decision led to the most exciting and fulfilling years of my life. Sure, it was chaotic at times, but I wouldn't trade this adventure for anything.`
    }
  };

  return responseTemplates[personality];
}