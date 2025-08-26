'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdvancedLifeTreeData, advancedLifeTreeEngine } from '@/lib/advanced-life-tree';
import { UserProfile } from '@/lib/types';
import Layout from '@/components/layout/layout';
import { VisualTree } from '@/components/life-tree/visual-tree';

export default function Dashboard() {
  const router = useRouter();
  const [treeData, setTreeData] = useState<AdvancedLifeTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMode, setChatMode] = useState<{ nodeId: string; title: string } | null>(null);

  // Mock user profile - in real app, load from API/localStorage
  const userProfile: UserProfile = {
    age: 28,
    occupation: 'Software Engineer',
    bigFive: {
      openness: 75,
      conscientiousness: 80,
      extraversion: 60,
      agreeableness: 70,
      neuroticism: 40
    },
    decisionStyle: 'analytical',
    values: ['Career Success', 'Financial Security', 'Work-Life Balance'],
    goals: ['Leadership Role', 'Start Family', 'Financial Freedom'],
    fears: ['Career Stagnation', 'Financial Instability', 'Health Issues']
  };

  useEffect(() => {
    generateLifeTree();
  }, []);

  const generateLifeTree = async () => {
    try {
      setLoading(true);
      console.log('🌳 Generating complete life tree...');
      
      const tree = await advancedLifeTreeEngine.generateCompleteLifeSimulation(userProfile);
      console.log('✅ Advanced life simulation generated:', tree.totalActions, 'actions');
      
      setTreeData(tree);
    } catch (error) {
      console.error('❌ Failed to generate life tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = async (actionId: string) => {
    console.log('🎯 Action selected:', actionId);
    const action = treeData?.actions.find(a => a.id === actionId);
    if (action) {
      console.log('📋 Action details:', {
        action: action.action,
        timeframe: action.timeframe,
        probability: action.probability,
        lifeStats: action.lifeStats
      });
    }
  };

  const handleActionOverride = async (actionId: string, newAction: string) => {
    if (!treeData) return;
    
    console.log('🔄 Overriding action:', actionId, 'with:', newAction);
    setLoading(true);
    
    try {
      const updatedTree = await advancedLifeTreeEngine.regenerateBranchWithMassiveDetail(actionId, newAction, treeData);
      console.log('✅ Tree regenerated with override');
      setTreeData(updatedTree);
    } catch (error) {
      console.error('❌ Failed to override branch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionChat = async (actionId: string) => {
    const action = treeData?.actions.find(a => a.id === actionId);
    if (action) {
      console.log('💬 Starting chat with action:', action.action);
      setChatMode({ nodeId: actionId, title: action.action });
    }
  };

  // Redirect to onboarding if not completed
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    if (!completed) {
      router.push('/onboarding');
    }
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              🌳 Generating Your Life Tree
            </h2>
            <p className="text-gray-600 max-w-md">
              Our AI is analyzing your psychology profile and simulating your life paths using Monte Carlo algorithms...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!treeData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Failed to Generate Life Tree
            </h2>
            <button 
              onClick={generateLifeTree}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-indigo-100 px-6 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🌳 Your Life Journey
              </h1>
              <p className="text-gray-600 mt-1">
                Exploring <span className="font-semibold text-indigo-600">{treeData.totalActions}</span> detailed life actions • Generated {treeData.generatedAt.toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                <span className="font-semibold">{userProfile.age} years old</span>
                <span className="mx-2">•</span>
                <span>{userProfile.occupation}</span>
              </div>
              
              <button
                onClick={generateLifeTree}
                className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span className="group-hover:rotate-180 transition-transform duration-300">🔄</span>
                Regenerate Tree
              </button>
            </div>
          </div>
        </div>

        {/* Life Tree Visualization */}
        <div className="flex-1">
          <div className="h-full">
            <div 
              className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden relative"
              style={{ height: 'calc(100vh - 160px)' }}
            >
              <VisualTree
                treeData={treeData}
                onActionClick={handleNodeClick}
                onActionOverride={handleActionOverride}
                onActionChat={handleActionChat}
              />
              
              {loading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-50">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">🧠</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">Recalculating Life Paths</h3>
                      <p className="text-gray-600">AI is analyzing new scenarios...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}