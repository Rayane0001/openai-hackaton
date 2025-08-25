'use client';

import { useState } from 'react';

interface TestResponse {
  success: boolean;
  message?: string;
  reasoning?: string;
  error?: string;
  model?: string;
  personality?: string;
  status?: string;
  fallback?: string;
}

export default function TestGptOssPage() {
  const [prompt, setPrompt] = useState('Tell me about your experience with making important life decisions.');
  const [personality, setPersonality] = useState('realistic');
  const [response, setResponse] = useState<TestResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const testGptOss = async () => {
    setLoading(true);
    setResponse(null);

    try {
      // Test with the chat endpoint which uses GPT-OSS
      const res = await fetch('/api/chat/test_scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: prompt,
          userId: 'test_user',
          messageHistory: []
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setResponse({
          success: true,
          message: data.message || 'No message received',
          reasoning: data.reasoning || 'No reasoning available',
          personality: personality,
          status: 'GPT-OSS integration test completed',
          model: 'gpt-oss via chat endpoint'
        });
      } else {
        setResponse({
          success: false,
          error: data.error || 'Unknown error',
          status: 'Test failed'
        });
      }
    } catch (error) {
      setResponse({ 
        success: false, 
        error: 'Network error', 
        status: error instanceof Error ? error.message : 'Unknown network error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">GPT-OSS Integration Test</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Test Prompt:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
            placeholder="Enter test prompt..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Personality:</label>
          <select 
            value={personality} 
            onChange={(e) => setPersonality(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="optimistic">Optimistic</option>
            <option value="realistic">Realistic</option>
            <option value="cautious">Cautious</option>
            <option value="adventurous">Adventurous</option>
          </select>
        </div>

        <button
          onClick={testGptOss}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing GPT-OSS...' : 'Test GPT-OSS Integration'}
        </button>
      </div>

      {response && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Response {response.success ? '✅' : '❌'}
          </h2>
          
          {response.success ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-green-700 mb-2">AI Message:</h3>
                <div className="bg-white p-4 rounded border">
                  {response.message || 'No message'}
                </div>
              </div>
              
              {response.reasoning && (
                <div>
                  <h3 className="font-medium text-blue-700 mb-2">Transparent Reasoning:</h3>
                  <div className="bg-blue-50 p-4 rounded border">
                    <pre className="whitespace-pre-wrap text-sm">
                      {response.reasoning}
                    </pre>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600 space-y-1">
                {response.model && <p><strong>Model:</strong> {response.model}</p>}
                {response.personality && <p><strong>Personality:</strong> {response.personality}</p>}
                {response.status && <p><strong>Status:</strong> {response.status}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-red-600"><strong>Error:</strong> {response.error}</p>
              {response.status && <p className="text-gray-600"><strong>Status:</strong> {response.status}</p>}
              {response.fallback && <p className="text-yellow-600"><strong>Note:</strong> {response.fallback}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}