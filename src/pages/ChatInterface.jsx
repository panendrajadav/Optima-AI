import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Plus, 
  Send, 
  LogOut, 
  FolderPlus, 
  Bot, 
  History,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Mic,
  MicOff,
  Paperclip,
  Image,
  Smile
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getOptimizedAnswer } from "@/utils/multiLLM";

// Gemini AI Response Function
const getGeminiResponse = async (query) => {
  // Placeholder for Gemini AI integration
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `Gemini AI Response: ${query}. This is a simulated response from Google's Gemini AI model with advanced reasoning and multimodal capabilities.`;
};

const ChatInterface = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  
  // Create Agent Modal State
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentGoal, setNewAgentGoal] = useState("");
  const [newAgentModel, setNewAgentModel] = useState("");
  
  // Sidebar State
  const [showAgents, setShowAgents] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentCreation, setShowAgentCreation] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        // Here you would typically send to speech-to-text API
        setInputValue("Voice message recorded (Speech-to-text integration needed)");
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Use Gemini AI (placeholder - replace with actual Gemini API)
      const aiResponse = await getGeminiResponse(inputValue);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgent = () => {
    if (!newAgentName.trim() || !newAgentGoal.trim() || !newAgentModel) return;

    const newAgent = {
      id: Date.now().toString(),
      name: newAgentName,
      goal: newAgentGoal,
      model: newAgentModel
    };

    setAgents(prev => [...prev, newAgent]);
    setNewAgentName("");
    setNewAgentGoal("");
    setNewAgentModel("");
    setIsCreateAgentOpen(false);
  };

  const startNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date()
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
  };

  const greeting = messages.length === 0 ? (
    <div className="text-center py-20">
      <Brain className="h-16 w-16 text-royal-gold mx-auto mb-6 animate-glow" />
      <h2 className="text-3xl font-bold mb-4 gradient-text">
        Hello, {user?.name}
      </h2>
      <p className="text-xl text-muted-foreground mb-8">
        Want to try a few things? I'm here to help with anything you need.
      </p>
      <div className="grid gap-4 max-w-2xl mx-auto">
        {[
          "What can you help me with today?",
          "Explain quantum computing in simple terms",
          "Write a creative story about space exploration",
          "Help me plan a productive day"
        ].map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="glass hover:glass-hover text-left justify-start p-4 h-auto"
            onClick={() => setInputValue(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`w-72 bg-white border-r border-slate-200 flex-col z-50 ${
        isSidebarOpen ? 'fixed left-0 top-0 h-full lg:relative' : 'hidden'
      } lg:flex`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-royal-blue to-royal-purple rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Optima AI</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-4">
          <Button 
            onClick={startNewConversation}
            className="w-full btn-royal justify-start"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Project
          </Button>

          {/* My Agents */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setShowAgents(!showAgents)}
              className="w-full justify-between text-left p-2 hover:bg-white/5"
            >
              <div className="flex items-center">
                <Bot className="h-4 w-4 mr-2" />
                My Agents
              </div>
              {showAgents ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            
            {showAgents && (
              <div className="pl-6 space-y-1">
                {agents.map((agent) => (
                  <Button
                    key={agent.id}
                    variant="ghost"
                    className="w-full justify-start text-sm p-2 hover:bg-white/5"
                  >
                    {agent.name}
                  </Button>
                ))}
                {agents.length === 0 && (
                  <p className="text-sm text-muted-foreground px-2">No agents created yet</p>
                )}
              </div>
            )}
          </div>

          {/* History */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setShowHistory(!showHistory)}
              className="w-full justify-between text-left p-2 hover:bg-white/5"
            >
              <div className="flex items-center">
                <History className="h-4 w-4 mr-2" />
                History
              </div>
              {showHistory ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            
            {showHistory && (
              <div className="pl-6 space-y-1">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className="w-full justify-start text-sm p-2 hover:bg-white/5"
                    onClick={() => {
                      setCurrentConversationId(conversation.id);
                      setMessages(conversation.messages);
                    }}
                  >
                    {conversation.title}
                  </Button>
                ))}
                {conversations.length === 0 && (
                  <p className="text-sm text-muted-foreground px-2">No conversations yet</p>
                )}
              </div>
            )}
          </div>

          {/* New Agent Button */}
          <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
            <DialogTrigger asChild>
              <Button className="w-full border-royal-gold border-2 bg-transparent text-royal-gold hover:bg-royal-gold hover:text-black transition-all">
                <Plus className="h-4 w-4 mr-2" />
                New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-white/20 max-w-md mx-auto">
              <DialogHeader className="text-center">
                <DialogTitle className="gradient-text text-2xl mb-2">Create New Agent</DialogTitle>
                <p className="text-muted-foreground text-sm">Choose your AI assistant</p>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input
                    id="agent-name"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    placeholder="Enter agent name"
                    className="glass border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="agent-goal">Agent Goal</Label>
                  <Textarea
                    id="agent-goal"
                    value={newAgentGoal}
                    onChange={(e) => setNewAgentGoal(e.target.value)}
                    placeholder="Describe what this agent should help with"
                    className="glass border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="agent-model" className="text-base font-semibold">Choose AI Model</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      { id: 'gemini', name: 'Gemini Pro', desc: 'Google AI' },
                      { id: 'gpt-4', name: 'GPT-4', desc: 'OpenAI' },
                      { id: 'claude', name: 'Claude', desc: 'Anthropic' },
                      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', desc: 'OpenAI' }
                    ].map((model) => (
                      <Button
                        key={model.id}
                        type="button"
                        variant={newAgentModel === model.id ? "default" : "outline"}
                        className={`h-auto p-3 flex-col space-y-1 ${
                          newAgentModel === model.id ? 'btn-royal' : 'glass border-white/20'
                        }`}
                        onClick={() => setNewAgentModel(model.id)}
                      >
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs opacity-70">{model.desc}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleCreateAgent}
                  className="w-full btn-hero"
                  disabled={!newAgentName || !newAgentGoal || !newAgentModel}
                >
                  Create Agent
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="text-xs bg-royal-gold text-black px-2 py-1 rounded mt-1 inline-block">
                  Admin
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Select value={selectedAgent?.id || "gemini"} onValueChange={(value) => {
              if (value === "new") {
                setIsCreateAgentOpen(true);
              } else {
                const agent = agents.find(a => a.id === value) || { id: value, name: value === "gemini" ? "Gemini Pro" : value, model: value };
                setSelectedAgent(agent);
              }
            }}>
              <SelectTrigger className="w-48 border-slate-300">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-slate-600" />
                    <span>{selectedAgent?.name || "Gemini Pro"}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Gemini Pro</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
                <SelectItem value="new" className="text-royal-blue">
                  + Create New Agent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden lg:flex"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 max-w-4xl mx-auto w-full">
          {greeting && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-r from-royal-blue to-royal-purple rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-800">
                Hello, {user?.name}
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                How can I help you today?
              </p>
              <div className="grid gap-3 max-w-2xl mx-auto">
                {[
                  "What can you help me with today?",
                  "Explain quantum computing in simple terms",
                  "Write a creative story about space exploration",
                  "Help me plan a productive day"
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start p-4 h-auto border-slate-200 hover:bg-slate-50"
                    onClick={() => setInputValue(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className="mb-8">
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-slate-100 rounded-2xl px-4 py-3 max-w-2xl">
                    <p className="text-slate-800">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-royal-blue to-royal-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 leading-relaxed">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-royal-blue to-royal-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <div className="bg-slate-100 rounded-3xl px-6 py-4 flex items-center space-x-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    placeholder="Enter a prompt here"
                    className="border-0 bg-transparent p-0 focus-visible:ring-0 flex-1 text-slate-800 placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-slate-200 rounded-full"
                    >
                      <Paperclip className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-slate-200'}`}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? <MicOff className="h-4 w-4 text-white" /> : <Mic className="h-4 w-4 text-slate-600" />}
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-12 w-12 p-0 bg-gradient-to-r from-royal-blue to-royal-purple hover:opacity-90 rounded-full"
              >
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>
            {isRecording && (
              <div className="mt-3 flex items-center justify-center space-x-2 text-red-500 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Recording...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;