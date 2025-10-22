import { callOpenAI, callClaude } from './multiLLM.js';

// Single LLM call function
async function callSingleLLM(prompt, model = 'openai') {
  try {
    if (model === 'gemini' || model === 'claude') {
      return await callClaude(prompt);
    } else {
      return await callOpenAI(prompt);
    }
  } catch (error) {
    console.error(`${model} call failed:`, error);
    return `Error: Could not get response from ${model}`;
  }
}

// Agent Goal Parser - Converts user input to structured goal
async function parseAgentGoal(userGoalInput, model = 'openai') {
  const parsePrompt = `Convert this user goal into a clear, structured format for an AI assistant:

User Input: "${userGoalInput}"

Respond with ONLY a JSON object in this format:
{
  "domain": "main subject area",
  "objective": "specific goal",
  "context": "relevant background",
  "scope": "what to focus on"
}`;

  try {
    const response = await callSingleLLM(parsePrompt, model);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Goal parsing failed:', error);
  }

  // Fallback parsing
  return {
    domain: extractDomain(userGoalInput),
    objective: userGoalInput.trim(),
    context: "General assistance",
    scope: "Help with user's specific needs"
  };
}

// Extract domain from user input
function extractDomain(input) {
  const domains = {
    'python': 'Python Programming',
    'javascript': 'JavaScript Development', 
    'react': 'React Development',
    'tic tac toe': 'Game Development',
    'web': 'Web Development',
    'api': 'API Development',
    'database': 'Database Management',
    'css': 'CSS Styling',
    'html': 'HTML Development'
  };
  
  const lowerInput = input.toLowerCase();
  for (const [key, value] of Object.entries(domains)) {
    if (lowerInput.includes(key)) return value;
  }
  return 'General Programming';
}

// Agent Response Generator
export async function getAgentResponse(userQuery, agentGoal, model = 'openai') {
  if (!agentGoal) {
    return await callSingleLLM(userQuery, model);
  }

  const agentPrompt = `You are a specialized AI assistant with this goal:
Domain: ${agentGoal.domain}
Objective: ${agentGoal.objective}
Context: ${agentGoal.context}
Scope: ${agentGoal.scope}

User Question: "${userQuery}"

Respond ONLY within your goal scope. If the question is unrelated, redirect it back to your objective. Keep responses focused and practical.`;

  return await callSingleLLM(agentPrompt, model);
}

// Create Agent from Goal
export async function createAgent(userGoalInput, model = 'openai') {
  const parsedGoal = await parseAgentGoal(userGoalInput, model);
  
  return {
    id: Date.now().toString(),
    goal: parsedGoal,
    model: model,
    created: new Date().toISOString(),
    respond: (query) => getAgentResponse(query, parsedGoal, model)
  };
}

// Agent Manager
class AgentManager {
  constructor() {
    this.agents = new Map();
  }

  async createAgent(goalInput) {
    const agent = await createAgent(goalInput);
    this.agents.set(agent.id, agent);
    return agent;
  }

  getAgent(id) {
    return this.agents.get(id);
  }

  deleteAgent(id) {
    return this.agents.delete(id);
  }

  listAgents() {
    return Array.from(this.agents.values());
  }
}

export const agentManager = new AgentManager();