import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { azureOpenAI, testAzureConnection } from '../utils/multiLLM';

export function AzureConfig() {
  const [config, setConfig] = useState({
    apiKey: '',
    endpoint: '',
    deploymentName: 'gpt-4',
    apiVersion: '2024-02-15-preview'
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load current config
    setConfig({
      apiKey: azureOpenAI.apiKey || '',
      endpoint: azureOpenAI.endpoint || '',
      deploymentName: azureOpenAI.deploymentName || 'gpt-4',
      apiVersion: azureOpenAI.apiVersion || '2024-02-15-preview'
    });
    setIsConnected(azureOpenAI.isConfigured());
  }, []);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const result = await testAzureConnection();
      setIsConnected(result);
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Update the client configuration
    Object.assign(azureOpenAI, config);
    setIsConnected(azureOpenAI.isConfigured());
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Azure OpenAI Configuration
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Enter your Azure OpenAI API key"
            />
          </div>
          
          <div>
            <Label htmlFor="endpoint">Endpoint</Label>
            <Input
              id="endpoint"
              value={config.endpoint}
              onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
              placeholder="https://your-resource-name.openai.azure.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deploymentName">Deployment Name</Label>
              <Input
                id="deploymentName"
                value={config.deploymentName}
                onChange={(e) => setConfig(prev => ({ ...prev, deploymentName: e.target.value }))}
                placeholder="gpt-4"
              />
            </div>
            
            <div>
              <Label htmlFor="apiVersion">API Version</Label>
              <Input
                id="apiVersion"
                value={config.apiVersion}
                onChange={(e) => setConfig(prev => ({ ...prev, apiVersion: e.target.value }))}
                placeholder="2024-02-15-preview"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="default">
            Save Configuration
          </Button>
          <Button 
            onClick={handleTest} 
            variant="outline" 
            disabled={isLoading || !config.apiKey || !config.endpoint}
          >
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}