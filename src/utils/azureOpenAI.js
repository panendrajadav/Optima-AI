// Azure OpenAI API Integration
// Flexible configuration for Azure AI Foundry

class AzureOpenAIClient {
  constructor() {
    this.apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
    this.endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
    this.apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
    this.deploymentName = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
  }

  // Validate configuration
  isConfigured() {
    return !!(this.apiKey && this.endpoint);
  }

  // Get deployment URL
  getDeploymentUrl(deploymentName = this.deploymentName) {
    return `${this.endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${this.apiVersion}`;
  }

  // Make API call to Azure OpenAI
  async chat(messages, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Azure OpenAI not configured. Check your environment variables.');
    }

    const {
      model = this.deploymentName,
      temperature = 0.7,
      maxTokens = 1000,
      stream = false
    } = options;

    const url = this.getDeploymentUrl(model);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      },
      body: JSON.stringify({
        messages,
        temperature,
        max_tokens: maxTokens,
        stream
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Azure OpenAI API error: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  // Simple text completion
  async complete(prompt, options = {}) {
    const messages = [{ role: 'user', content: prompt }];
    const response = await this.chat(messages, options);
    return response.choices[0]?.message?.content || '';
  }

  // Chat completion with deployment support
  async getChatCompletion(prompt, options = {}) {
    const { deployment, ...chatOptions } = options;
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ];
    
    const url = this.getDeploymentUrl(deployment || this.deploymentName);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      },
      body: JSON.stringify({
        messages,
        temperature: chatOptions.temperature || 0.7,
        max_tokens: chatOptions.maxTokens || 1000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Azure API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || '';
  }

  // Test connection
  async testConnection() {
    try {
      const response = await this.complete('Hello', { maxTokens: 10 });
      return { success: true, response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const azureOpenAI = new AzureOpenAIClient();

// Export class for custom instances
export { AzureOpenAIClient };

// Utility functions
export const createAzureClient = (config) => {
  const client = new AzureOpenAIClient();
  Object.assign(client, config);
  return client;
};

export const getAvailableModels = () => [
  'gpt-4',
  'gpt-4-32k',
  'gpt-35-turbo',
  'gpt-35-turbo-16k'
];