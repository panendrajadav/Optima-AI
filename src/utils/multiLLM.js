// Multi-LLM Decision Agent System
import { azureOpenAI } from './azureOpenAI.js';

// Azure AI Foundry API Calls with fallback
async function tryDeployments(endpoint, apiKey, messages, deployments) {
  for (const deployment of deployments) {
    try {
      const response = await fetch(`${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          messages,
          max_tokens: 1000,
          temperature: 0.7
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No response";
      }
    } catch (error) {
      continue;
    }
  }
  throw new Error('All deployments failed');
}

async function callOpenAI(query) {
  const endpoint = import.meta.env.VITE_OPENAI_ENDPOINT?.replace(/\/$/, '');
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!endpoint || !apiKey) {
    return "OpenAI: Demo response - I'm a conservative AI assistant providing structured answers.";
  }
  
  const deployments = ['gpt-4o-mini'];
  const messages = [{ role: 'user', content: query }];
  
  try {
    return await tryDeployments(endpoint, apiKey, messages, deployments);
  } catch (error) {
    return "OpenAI: Demo response - I'm a conservative AI assistant providing structured answers.";
  }
}

async function callClaude(query) {
  const endpoint = import.meta.env.VITE_GEMINI_ENDPOINT?.replace(/\/$/, '');
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!endpoint || !apiKey) {
    return "Gemini: Demo response - I'm a creative AI assistant providing detailed explanations with examples and comprehensive insights.";
  }
  
  const deployments = ['gpt-4'];
  const messages = [
    { role: 'system', content: 'You are a creative and detailed assistant. Provide comprehensive explanations with examples.' },
    { role: 'user', content: query }
  ];
  
  try {
    return await tryDeployments(endpoint, apiKey, messages, deployments);
  } catch (error) {
    return "Gemini: Demo response - I'm a creative AI assistant providing detailed explanations with examples and comprehensive insights.";
  }
}

// Multi-LLM Decision Agent
export async function getOptimizedAnswer(userQuery) {
  console.log("🤖 Multi-LLM Decision Agent: Processing query...");
  console.log("📤 Sending to: OpenAI (Conservative), Gemini (Creative)");
  
  let openaiResponse = "API Error: Could not get OpenAI response";
  let claudeResponse = "API Error: Could not get Claude response";
  
  // Try OpenAI
  openaiResponse = await callOpenAI(userQuery);
  console.log("✅ OpenAI response received");
  
  // Try Gemini
  claudeResponse = await callClaude(userQuery);
  console.log("✅ Gemini response received");
  
  // Score responses
  const openaiScore = openaiResponse.length;
  const claudeScore = claudeResponse.length;

  console.log(`\n📊 Scores: OpenAI: ${openaiScore} chars | Gemini: ${claudeScore} chars`);

  // Choose shorter response
  const winner = openaiScore < claudeScore ? "OpenAI (Conservative)" : "Gemini (Creative)";
  const selectedResponse = openaiScore < claudeScore ? openaiResponse : claudeResponse;
  
  console.log(`🏆 Selected: ${winner}`);
  
  return selectedResponse;
}

// Agent-specific responses
export async function getAgentResponse(query, agentGoal) {
  if (!agentGoal) {
    return await getOptimizedAnswer(query);
  }

  const agentPrompt = `You are a specialized AI assistant focused on: ${agentGoal}

User Question: "${query}"

Respond ONLY within your specialization. If unrelated, redirect back to your focus area.`;

  return await getOptimizedAnswer(agentPrompt);
}

// Generate chat title from AI response
export async function generateChatTitle(aiResponse) {
  try {
    const text = (typeof aiResponse === 'string' ? aiResponse : String(aiResponse || '')).toLowerCase();
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    const sentences = text.split(/[.!?]/);
    const firstSentence = sentences[0] || text;
    const words = firstSentence.split(/\s+/);
    
    const meaningfulWords = words.filter(word => 
      word.length > 3 && 
      !stopWords.includes(word.toLowerCase()) && 
      /^[a-zA-Z]+$/.test(word)
    );
    
    if (meaningfulWords.length > 0) {
      const titleWords = meaningfulWords.slice(0, 3);
      const title = titleWords.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }
    
    const fallbackTitle = text.split(' ').slice(0, 4).join(' ');
    return fallbackTitle.length > 30 ? fallbackTitle.substring(0, 30) + '...' : fallbackTitle;
    
  } catch (error) {
    console.error('Title generation error:', error);
    return 'New Chat';
  }
}

// Utility functions
export async function testAzureConnection() {
  try {
    console.log("🔗 Testing Azure OpenAI connection...");
    const result = await azureOpenAI.testConnection();
    
    if (result.success) {
      console.log("✅ Azure OpenAI connection successful");
      return true;
    } else {
      console.error("❌ Azure OpenAI connection failed:", result.error);
      return false;
    }
  } catch (error) {
    console.error("Azure Connection Test Failed:", error);
    return false;
  }
}

export { azureOpenAI, callOpenAI, callClaude };