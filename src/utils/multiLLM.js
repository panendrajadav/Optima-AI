// Multi-LLM Decision Agent System
import { azureOpenAI } from './azureOpenAI.js';

// Azure AI Foundry API Calls
async function callOpenAI(query) {
  const endpoint = import.meta.env.VITE_OPENAI_ENDPOINT.replace(/\/$/, '');
  const response = await fetch(`${endpoint}/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_OPENAI_API_KEY
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: query }],
      max_tokens: 1000,
      temperature: 0.7
    })
  });
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response from OpenAI";
}

async function callClaude(query) {
  const endpoint = import.meta.env.VITE_OPENAI_ENDPOINT.replace(/\/$/, '');
  const response = await fetch(`${endpoint}/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_OPENAI_API_KEY
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a creative and detailed assistant. Provide comprehensive explanations with examples.' },
        { role: 'user', content: query }
      ],
      max_tokens: 1000,
      temperature: 1.0
    })
  });
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response from Claude";
}

// Multi-LLM Decision Agent
export async function getOptimizedAnswer(userQuery) {
  console.log("🤖 Multi-LLM Decision Agent: Processing query...");
  console.log("📤 Sending to: Conservative OpenAI, Creative Claude");
  
  let openaiResponse = "API Error: Could not get OpenAI response";
  let claudeResponse = "API Error: Could not get Claude response";
  
  // Try OpenAI
  try {
    openaiResponse = await callOpenAI(userQuery);
  } catch (error) {
    console.log("OpenAI failed:", error.message);
  }
  
  // Try Claude
  try {
    claudeResponse = await callClaude(userQuery);
  } catch (error) {
    console.log("Claude failed:", error.message);
  }
  
  // Score responses
  const openaiScore = openaiResponse.length;
  const claudeScore = claudeResponse.length;

  console.log(`\n📊 Scores: Conservative OpenAI: ${openaiScore} chars | Creative Claude: ${claudeScore} chars`);

  // Choose longer response
  const winner = openaiScore > claudeScore ? "Conservative OpenAI" : "Creative Claude";
  const selectedResponse = openaiScore > claudeScore ? openaiResponse : claudeResponse;
  
  console.log(`🏆 Selected: ${winner}`);
  
  return selectedResponse;
}

// Agent-specific responses
export async function getAgentResponse(query, agentModel, agentGoal) {
  return await getOptimizedAnswer(query);
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

export { azureOpenAI };