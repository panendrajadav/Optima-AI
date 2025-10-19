// Multi-LLM Integration with Azure AI Foundry
import { azureOpenAI } from './azureOpenAI.js';

// Secure API Configuration
const API_CONFIG = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  CLAUDE_API_KEY: import.meta.env.VITE_CLAUDE_API_KEY,
  AZURE_OPENAI_API_KEY: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_ENDPOINT: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT
};

// Check if API keys are configured
const checkApiKeys = () => {
  const missing = [];
  if (!API_CONFIG.GEMINI_API_KEY) missing.push('GEMINI');
  if (!API_CONFIG.OPENAI_API_KEY) missing.push('OPENAI');
  if (missing.length > 0) {
    console.warn(`Missing API keys: ${missing.join(', ')}. Add them to .env file.`);
  }
};

// Azure OpenAI GPT-4 API call
async function callLLM1(query) {
  try {
    if (!azureOpenAI.isConfigured()) {
      console.warn('Azure OpenAI not configured, using fallback response');
      return {
        output: `GPT-4 Response: ${query}. This response demonstrates comprehensive analysis with detailed explanations and examples.`,
        model: "gpt-4",
        confidence: 0.92,
        tokens: 150
      };
    }

    const response = await azureOpenAI.complete(query, {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000
    });

    return {
      output: response,
      model: "gpt-4",
      confidence: 0.92,
      tokens: response.length / 4 // Rough token estimation
    };
  } catch (error) {
    console.error('Azure OpenAI API error:', error);
    return {
      output: `I apologize, but I'm experiencing technical difficulties with Azure OpenAI. Please try again.`,
      model: "gpt-4",
      confidence: 0.5,
      tokens: 20
    };
  }
}

// Simulated API call to Azure AI Foundry Model 2 (Claude)
async function callLLM2(query) {
  // Placeholder - replace with actual Azure AI API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        output: `Claude Response: ${query}. This response focuses on clarity, accuracy, and practical insights with a conversational tone.`,
        model: "claude",
        confidence: 0.89,
        tokens: 120
      });
    }, 1200);
  });
}

// Simple response evaluator
function evaluateResponses(response1, response2) {
  // Evaluation criteria:
  // 1. Confidence score
  // 2. Response length (more comprehensive)
  // 3. Token efficiency

  const score1 = response1.confidence * 0.6 + (response1.output.length / 1000) * 0.3 + (1 / response1.tokens * 100) * 0.1;
  const score2 = response2.confidence * 0.6 + (response2.output.length / 1000) * 0.3 + (1 / response2.tokens * 100) * 0.1;

  return score1 > score2 ? response1 : response2;
}

// Main function to get optimized answer using dual LLM approach
export async function getOptimizedAnswer(userQuery) {
  try {
    console.log("🤖 Optima AI: Processing query with dual LLM approach...");

    // Call both models in parallel
    const [response1, response2] = await Promise.all([
      callLLM1(userQuery),
      callLLM2(userQuery)
    ]);

    console.log("📊 Model 1 (GPT-4):", {
      confidence: response1.confidence,
      tokens: response1.tokens
    });
    console.log("📊 Model 2 (Claude):", {
      confidence: response2.confidence,
      tokens: response2.tokens
    });

    // Evaluate and select the best response
    const bestResponse = evaluateResponses(response1, response2);

    console.log(`✅ Selected best response from: ${bestResponse.model}`);

    return bestResponse.output;

  } catch (error) {
    console.error("❌ Multi-LLM Error:", error);
    return "I apologize, but I'm currently experiencing technical difficulties. Please try again in a moment.";
  }
}

// Function to get response from specific agent/model
export async function getAgentResponse(
  query,
  agentModel,
  agentGoal
) {
  try {
    // Customize the query based on agent's goal
    const contextualQuery = `${agentGoal}\n\nUser Query: ${query}`;

    // Route to appropriate model based on agent configuration
    switch (agentModel) {
      case "gpt-4": {
        const gptResponse = await callLLM1(contextualQuery);
        return gptResponse.output;
      }

      case "claude": {
        const claudeResponse = await callLLM2(contextualQuery);
        return claudeResponse.output;
      }

      default:
        // Use dual LLM approach for other models
        return await getOptimizedAnswer(contextualQuery);
    }
  } catch (error) {
    console.error("Agent Response Error:", error);
    return "I encountered an error processing your request. Please try again.";
  }
}

// Utility function to test Azure OpenAI connection
export async function testAzureConnection() {
  try {
    console.log("🔗 Testing Azure OpenAI connection...");
    console.log("📡 Endpoint:", azureOpenAI.endpoint);
    console.log("🔑 API Key:", azureOpenAI.apiKey ? "Configured" : "Missing");

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

// Export Azure OpenAI client for direct use
export { azureOpenAI };
