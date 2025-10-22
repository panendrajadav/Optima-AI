import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { createAgent } from '../utils/agentSystem';

export function AgentCreator({ onAgentCreated }) {
  const [goalInput, setGoalInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);

  const handleCreateAgent = async () => {
    if (!goalInput.trim()) return;
    
    setIsCreating(true);
    try {
      const agent = await createAgent(goalInput);
      setCurrentAgent(agent);
      onAgentCreated?.(agent);
      setGoalInput('');
    } catch (error) {
      console.error('Agent creation failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Specialized Agent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g., I want help with Python programming"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateAgent()}
            />
            <Button 
              onClick={handleCreateAgent}
              disabled={isCreating || !goalInput.trim()}
            >
              {isCreating ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {currentAgent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Active Agent
              <Badge variant="default">Specialized</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Domain:</strong> {currentAgent.goal.domain}</p>
              <p><strong>Objective:</strong> {currentAgent.goal.objective}</p>
              <p><strong>Scope:</strong> {currentAgent.goal.scope}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}