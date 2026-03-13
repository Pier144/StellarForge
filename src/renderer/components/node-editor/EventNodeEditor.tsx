// src/renderer/components/node-editor/EventNodeEditor.tsx
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { EventNode, type EventNodeData } from './EventNode';
import { OptionEdge } from './OptionEdge';
import { NodeInspector } from './NodeInspector';

const nodeTypes = { event: EventNode };
const edgeTypes = { option: OptionEdge };

interface Props {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
}

let nodeIdCounter = 0;

export function EventNodeEditor({ initialNodes = [], initialEdges = [], onNodesChange: onNodesChangeProp, onEdgesChange: onEdgesChangeProp }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge({ ...connection, type: 'option' }, eds));
  }, [setEdges]);

  const addEvent = useCallback((x = 100, y = 100) => {
    const id = `event_${++nodeIdCounter}`;
    const newNode: Node = {
      id,
      type: 'event',
      position: { x, y },
      data: {
        eventId: id,
        title: '',
        type: 'country_event',
        options: [{ id: `${id}_opt_1`, name: 'Option 1' }],
        isTriggeredOnly: true,
      } satisfies EventNodeData,
    };
    setNodes(nds => [...nds, newNode]);
    setSelectedNodeId(id);
  }, [setNodes]);

  const updateNodeData = useCallback((nodeId: string, updates: Partial<EventNodeData>) => {
    setNodes(nds => nds.map(n => {
      if (n.id !== nodeId) return n;
      return { ...n, data: { ...n.data, ...updates } };
    }));
  }, [setNodes]);

  const addOption = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes(nds => nds.map(n => {
      if (n.id !== selectedNodeId) return n;
      const data = n.data as unknown as EventNodeData;
      const optId = `${n.id}_opt_${data.options.length + 1}`;
      return {
        ...n,
        data: {
          ...n.data,
          options: [...data.options, { id: optId, name: `Option ${data.options.length + 1}` }],
        },
      };
    }));
  }, [selectedNodeId, setNodes]);

  const removeOption = useCallback((optId: string) => {
    if (!selectedNodeId) return;
    setNodes(nds => nds.map(n => {
      if (n.id !== selectedNodeId) return n;
      const data = n.data as unknown as EventNodeData;
      return {
        ...n,
        data: { ...n.data, options: data.options.filter(o => o.id !== optId) },
      };
    }));
    // Also remove edges from this option
    setEdges(eds => eds.filter(e => e.sourceHandle !== optId));
  }, [selectedNodeId, setNodes, setEdges]);

  const handleItemChange = useCallback((item: Record<string, unknown>) => {
    if (!selectedNodeId) return;
    updateNodeData(selectedNodeId, {
      eventId: (item.id as string) ?? '',
      title: (item.title as string) ?? '',
      type: (item.type as EventNodeData['type']) ?? 'country_event',
      isTriggeredOnly: (item.is_triggered_only as boolean) ?? true,
    });
  }, [selectedNodeId, updateNodeData]);

  const deleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes(nds => nds.filter(n => n.id !== selectedNodeId));
    setEdges(eds => eds.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  // Suppress unused variable warnings for prop callbacks
  void onNodesChangeProp;
  void onEdgesChangeProp;

  return (
    <div className="flex h-full">
      <div className="flex-1 relative">
        {/* Toolbar */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <button onClick={() => addEvent(Math.random() * 400 + 50, Math.random() * 300 + 50)}
            className="px-3 py-1.5 bg-[var(--sf-bg-card)] border border-[var(--sf-border)] rounded text-xs text-[var(--sf-text-secondary)] hover:border-[var(--sf-accent)]">
            + Add Event
          </button>
          {selectedNodeId && (
            <button onClick={deleteSelected}
              className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 hover:bg-red-500/20">
              Delete
            </button>
          )}
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Controls className="!bg-[var(--sf-bg-card)] !border-[var(--sf-border)]" />
          <MiniMap className="!bg-[var(--sf-bg-secondary)]" />
          <Background variant={BackgroundVariant.Dots} color="var(--sf-border)" gap={20} />
        </ReactFlow>
      </div>

      {/* Inspector panel */}
      {selectedNode && (
        <NodeInspector
          nodeData={selectedNode.data as unknown as EventNodeData}
          item={{
            id: (selectedNode.data as unknown as EventNodeData).eventId,
            title: (selectedNode.data as unknown as EventNodeData).title,
            type: (selectedNode.data as unknown as EventNodeData).type,
            is_triggered_only: (selectedNode.data as unknown as EventNodeData).isTriggeredOnly,
          }}
          onChange={handleItemChange}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}
