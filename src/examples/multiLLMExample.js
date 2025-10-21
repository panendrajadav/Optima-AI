import { getOptimizedAnswer, MultiLLMPipeline, quickDecision } from '../utils/multiLLM.js';

// Example 1: Basic Multi-LLM Decision Agent Usage
async function basicExample() {
  console.log("=== Basic Multi-LLM Decision Agent ===");
  
  const userQuery = "What are the key benefits of renewable energy?";
  const result = await getOptimizedAnswer(userQuery);
  
  console.log("Query:", result.query);
  console.log("\n--- LLM Responses ---");
  result.llmResponses.forEach((response, index) => {
    console.log(`${index + 1}. ${response.model}:`);
    console.log(`   Response: ${response.response.substring(0, 100)}...`);
    console.log(`   Metrics: ${JSON.stringify(response.metrics)}`);
  });
  
  console.log("\n--- Judge Evaluation ---");
  console.log("Winner:", result.judgeEvaluation.winner);
  console.log("Reasoning:", result.judgeEvaluation.reasoning);
  
  console.log("\n--- Best Response ---");
  console.log("Selected Model:", result.bestResponse.selectedModel);
  console.log("Final Answer:", result.bestResponse.finalAnswer.substring(0, 200) + "...");
}

// Example 2: Advanced Pipeline Usage
async function advancedPipelineExample() {
  console.log("\n=== Advanced Pipeline Usage ===");
  
  const pipeline = new MultiLLMPipeline({
    maxConcurrentLLMs: 4,
    timeoutMs: 15000
  });
  
  const userQuery = "Explain quantum computing in simple terms";
  const result = await pipeline.executePipeline(userQuery, { numModels: 3 });
  
  console.log("Pipeline Result:");
  console.log("- Models Used:", result.pipeline.modelsUsed.join(", "));
  console.log("- Winner:", result.judgment.winner);
  console.log("- Best Response:", result.result.bestResponse.substring(0, 150) + "...");
}

// Example 3: Quick Decision (Simplified Interface)
async function quickDecisionExample() {
  console.log("\n=== Quick Decision Example ===");
  
  const result = await quickDecision("What is machine learning?", 2);
  
  console.log("Quick Decision Result:");
  console.log("- Best Response:", result.bestResponse.substring(0, 100) + "...");
  console.log("- Judge Winner:", result.judgeEvaluation.winner);
}

// Run all examples
async function runExamples() {
  try {
    await basicExample();
    await advancedPipelineExample();
    await quickDecisionExample();
  } catch (error) {
    console.error("Example execution error:", error);
  }
}

export { runExamples, basicExample, advancedPipelineExample, quickDecisionExample };