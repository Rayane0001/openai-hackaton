'use client';

import React, { useState, useMemo } from 'react';
import { AdvancedLifeTreeData, LifeAction } from '@/lib/advanced-life-tree';
import Tree from 'react-d3-tree';

interface VisualTreeProps {
  treeData: AdvancedLifeTreeData;
  onActionClick: (actionId: string) => void;
  onActionOverride: (actionId: string, newAction: string) => void;
  onActionChat: (actionId: string) => void;
}

// Format pour react-d3-tree
interface D3TreeNode {
  name: string;
  attributes?: {
    age: number;
    action: string;
    probability: number;
    actionType: string;
    id: string;
  };
  children?: D3TreeNode[];
}

export function VisualTree({ treeData, onActionClick, onActionOverride, onActionChat }: VisualTreeProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Convertir les données pour react-d3-tree
  const d3TreeData = useMemo((): D3TreeNode | null => {
    if (!treeData.actions.length) return null;

    // Trouver la racine
    const rootAction = treeData.actions.find(a => a.level === 0);
    if (!rootAction) return null;

    const userAge = treeData.userProfile?.age || 28;

    // Construire l'arbre récursivement
    const buildD3Node = (action: LifeAction): D3TreeNode => {
      const age = userAge + Math.floor(action.timeframe / 12);
      
      return {
        name: `Age ${age}`,
        attributes: {
          age,
          action: action.action,
          probability: action.probability,
          actionType: action.actionType,
          id: action.id
        },
        children: action.children.map(child => buildD3Node(child))
      };
    };

    return buildD3Node(rootAction);
  }, [treeData]);

  // Couleurs par type d'action
  const getNodeColor = (actionType: string) => {
    const colors = {
      milestone: '#10b981', // green
      major_decision: '#3b82f6', // blue  
      micro_decision: '#f59e0b', // amber
      consequence: '#8b5cf6', // purple
      life_event: '#ef4444' // red
    };
    return colors[actionType as keyof typeof colors] || colors.micro_decision;
  };

  // Node personnalisé pour react-d3-tree
  const renderCustomNode = ({ nodeDatum }: { nodeDatum: any }) => {
    const nodeColor = getNodeColor(nodeDatum.attributes?.actionType || 'micro_decision');
    const isSelected = selectedNode === nodeDatum.attributes?.id;
    
    return (
      <g>
        {/* Cercle principal */}
        <circle
          r={isSelected ? 40 : 30}
          fill={nodeColor}
          stroke="#ffffff"
          strokeWidth="3"
          onClick={() => {
            setSelectedNode(nodeDatum.attributes?.id || null);
            if (nodeDatum.attributes?.id) {
              onActionClick(nodeDatum.attributes.id);
            }
          }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Âge dans le cercle */}
        <text 
          fill="white" 
          fontSize="16" 
          fontWeight="bold"
          textAnchor="middle" 
          dy="0.3em"
        >
          {nodeDatum.attributes?.age}
        </text>
        
        {/* Action en dessous */}
        <text 
          fill="#1f2937" 
          fontSize="12" 
          textAnchor="middle" 
          y="50"
          style={{ maxWidth: '150px' }}
        >
          {nodeDatum.attributes?.action?.slice(0, 20) || ''}
          {(nodeDatum.attributes?.action?.length || 0) > 20 ? '...' : ''}
        </text>
        
        {/* Probabilité */}
        {nodeDatum.attributes?.probability && (
          <text 
            fill="#64748b" 
            fontSize="10" 
            textAnchor="middle" 
            y="65"
          >
            {Math.round(nodeDatum.attributes.probability * 100)}%
          </text>
        )}
        
        {/* Boutons d'action pour le noeud sélectionné */}
        {isSelected && (
          <g>
            {/* Chat button */}
            <circle
              cx="-25"
              cy="75"
              r="12"
              fill="#3b82f6"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                if (nodeDatum.attributes?.id) {
                  onActionChat(nodeDatum.attributes.id);
                }
              }}
            />
            <text x="-25" y="78" fill="white" fontSize="10" textAnchor="middle">💬</text>
            
            {/* Override button */}
            <circle
              cx="25"
              cy="75"
              r="12"
              fill="#f59e0b"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                // Override functionality
              }}
            />
            <text x="25" y="78" fill="white" fontSize="10" textAnchor="middle">🎯</text>
          </g>
        )}
      </g>
    );
  };

  if (!d3TreeData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center space-y-4">
          <div className="text-6xl">🌳</div>
          <h3 className="text-xl font-semibold">No life tree available</h3>
          <p>Complete the assessment to generate your tree.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* React D3 Tree */}
      <div style={{ width: '100%', height: '100%' }}>
        <Tree
          data={d3TreeData}
          orientation="vertical"
          translate={{ x: 400, y: 100 }}
          separation={{ siblings: 2, nonSiblings: 2 }}
          nodeSize={{ x: 300, y: 200 }}
          renderCustomNodeElement={renderCustomNode}
          zoom={0.4}
          scaleExtent={{ min: 0.1, max: 3 }}
          enableLegacyTransitions={false}
        />
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 mb-2">Life Journey Tree</h3>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Milestones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Major Decisions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span>Daily Actions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span>Consequences</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Life Events</span>
          </div>
        </div>
        <div className="border-t pt-2 mt-2 text-xs text-gray-600">
          <div>Numbers = Age at action</div>
          <div>Click nodes to interact</div>
        </div>
      </div>
    </div>
  );
}