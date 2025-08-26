'use client';

import Link from 'next/link';
import Layout from '@/components/layout/layout';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 leading-tight">
                Future Self
              </h1>
              <p className="text-2xl md:text-3xl text-gray-600 font-light max-w-4xl mx-auto">
                Chat with four versions of your future self to make 
                <span className="text-indigo-600 font-medium"> life-changing decisions</span> with confidence
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/onboarding">
                <Button className="group px-10 py-5 text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                  Start Your Journey
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">✨</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="px-10 py-5 text-xl font-medium border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-300">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered system creates personalized future scenarios based on your psychology and decisions
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="group text-center space-y-6 p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform">
                🧠
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Psychology Assessment</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Complete our 3-tier psychological profile to understand your personality, values, and decision-making patterns
              </p>
            </div>

            <div className="group text-center space-y-6 p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-gray-900">AI Analysis</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our advanced AI generates four distinct future scenarios based on your profile and life context
              </p>
            </div>

            <div className="group text-center space-y-6 p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl text-white group-hover:scale-110 transition-transform">
                💬
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Future Conversations</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Chat with four versions of your future self who lived through different outcomes and decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Selves */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl font-bold text-gray-900">Meet Your Future Selves</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four distinct personalities, each with unique perspectives on your decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-green-400">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🌟
              </div>
              <h4 className="text-xl font-bold text-green-700 mb-3">The Optimist</h4>
              <p className="text-gray-600 leading-relaxed">
                Everything went better than expected. Sees maximum benefits and positive outcomes.
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-blue-400">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                ⚖️
              </div>
              <h4 className="text-xl font-bold text-blue-700 mb-3">The Realist</h4>
              <p className="text-gray-600 leading-relaxed">
                Balanced outcomes with normal challenges. Provides honest, grounded perspective.
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-yellow-400">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h4 className="text-xl font-bold text-yellow-700 mb-3">The Guardian</h4>
              <p className="text-gray-600 leading-relaxed">
                Played it safe and prioritized security. Wisdom from the cautious path.
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-purple-400">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h4 className="text-xl font-bold text-purple-700 mb-3">The Explorer</h4>
              <p className="text-gray-600 leading-relaxed">
                Took bold risks for high rewards. Shares insights from the adventurous journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-5xl font-bold text-gray-900">Why Future Self?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology meets human psychology for unprecedented decision-making support
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="group p-10 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform">
                  🔍
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparent AI Reasoning</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    See exactly how our AI analyzes your decisions. Complete transparency in every recommendation with detailed reasoning chains.
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-10 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform">
                  📊
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Life Impact Modeling</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Track how decisions affect your finances, career, relationships, health, and happiness across 15-year projections.
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-10 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Analysis</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Every scenario is tailored to your unique personality, values, life situation, and decision-making patterns.
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-10 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform">
                  ⏰
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Timeline Projections</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Visualize how your life evolves at 5, 10, and 15-year intervals based on different decision paths.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Your Future Self is Waiting
            </h2>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto leading-relaxed">
              Join the revolution in decision-making. Get personalized AI guidance that understands who you really are.
            </p>
            <div className="pt-8">
              <Link href="/onboarding">
                <Button className="group px-12 py-6 text-2xl font-medium bg-white text-indigo-600 hover:bg-gray-50 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
                  Begin Your Journey
                  <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}