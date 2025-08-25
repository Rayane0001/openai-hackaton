// @file src/app/page.tsx
// Homepage for Future Self Decision Advisor

'use client';

import Link from 'next/link';
import Layout from '@/components/layout/layout';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default function HomePage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-16">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Chat with Your <span className="text-purple-600">Future Self</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Make better life decisions by talking to four versions of your future self.
              Each one has lived through different outcomes and can share their wisdom.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Your Journey 🔮
              </Button>
            </Link>
            <Link href="/decision">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Analyze a Decision
              </Button>
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-12">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-3">Share Your Profile</h3>
              <p className="text-gray-600">
                Complete our 3-tier psychological assessment to help us understand
                your personality, values, and decision-making style.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="text-4xl mb-4">🤔</div>
              <h3 className="text-xl font-semibold mb-3">Describe Your Decision</h3>
              <p className="text-gray-600">
                Tell us about the life decision you&apos;re facing. Our AI analyzes
                the context and generates personalized future scenarios.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-3">Chat with Future Selves</h3>
              <p className="text-gray-600">
                Talk to four versions of your future self who lived through
                different outcomes. Get wisdom from their experiences.
              </p>
            </Card>
          </div>
        </div>

        {/* Future Selves Preview */}
        <div className="space-y-12">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Meet Your Future Selves
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl mb-3">🌟</div>
              <h4 className="font-semibold text-green-700 mb-2">Optimistic Self</h4>
              <p className="text-sm text-gray-600">
                Everything went better than expected. Maximum benefits realized.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-3xl mb-3">⚖️</div>
              <h4 className="font-semibold text-blue-700 mb-2">Realistic Self</h4>
              <p className="text-sm text-gray-600">
                Balanced outcomes with normal challenges and successes.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="font-semibold text-yellow-700 mb-2">Cautious Self</h4>
              <p className="text-sm text-gray-600">
                Played it safe, prioritized security and stability.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold text-purple-700 mb-2">Adventurous Self</h4>
              <p className="text-sm text-gray-600">
                Took bold risks with high-reward outcomes.
              </p>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-12">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Why Choose Future Self?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🔍</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Transparent AI Reasoning</h3>
                  <p className="text-gray-600">
                    See exactly how our AI thinks through your decision. 
                    Transparent reasoning chains you can trust.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📊</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Life Impact Tracking</h3>
                  <p className="text-gray-600">
                    Track how decisions affect your finances, happiness, career,
                    relationships, and health over 15 years.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Personalized Analysis</h3>
                  <p className="text-gray-600">
                    Every analysis is tailored to your personality, values,
                    and life situation for maximum relevance.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">⏰</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Timeline Projections</h3>
                  <p className="text-gray-600">
                    See how your life metrics evolve at 5, 10, and 15 year
                    intervals based on your decisions.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-8 py-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to Meet Your Future Self?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of people making better decisions with AI-powered
              future scenario analysis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <Button size="lg" className="px-8 py-4 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}