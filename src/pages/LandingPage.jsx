import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Zap, MessageSquare, Bot, ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-royal-blue via-royal-purple to-royal-navy opacity-10"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* Header */}
      <header className="relative z-50 flex items-center justify-between p-3 md:p-6 glass-card mx-3 md:mx-6 mt-3 md:mt-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-royal-gold" />
          <span className="text-2xl font-bold gradient-text">Optima AI</span>
        </div>
        
        <nav className="flex items-center space-x-4 md:space-x-8">
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-royal-purple transition-colors font-bold">
              Home
            </Link>
            {user ? (
              <Link to="/chat">
                <Button className="btn-royal">
                  Go to Chat
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="btn-royal">
                  Login
                </Button>
              </Link>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>
        
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-3 md:mx-6 glass-card border border-white/20 md:hidden">
            <div className="p-4 space-y-4">
              <Link 
                to="/" 
                className="block text-foreground hover:text-royal-purple transition-colors font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {user ? (
                <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full btn-royal">
                    Go to Chat
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full btn-royal">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-3 md:px-6 py-10 md:py-20 text-center">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Centered Text Content */}
          <div className="space-y-6 md:space-y-8 animate-fade-up max-w-4xl">
            <h1 className="text-7xl font-bold leading-tight gradient-text">
              Optima AI
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-lavender">
              Get the Best Answer, Every Time
            </h2>
            <p className="text-lg md:text-xl text-lavender-light leading-relaxed">
              Powered by dual intelligence, refined for accuracy and clarity
            </p>
            <div className="flex space-x-4 justify-center mt-6">
              <Link to="/login">
                <Button className="bg-amber-400 text-black hover:bg-amber-500">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" className="border-lavender text-lavender hover:bg-lavender/10">
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* Two Brain Effects */}
          <div className="relative flex items-center justify-center space-x-8 mt-8">
            {/* Brain 1 */}
            <div className="relative w-24 h-24 animate-float animate-spin" style={{animationDuration: '20s'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-royal-blue to-royal-purple rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-royal-gold to-royal-purple animate-brain-glow flex items-center justify-center">
                <Brain className="w-12 h-12 text-white animate-neural-pulse" />
              </div>
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '12s'}}>
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-royal-gold rounded-full transform -translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-royal-gold rounded-full transform -translate-x-1/2 animate-pulse"></div>
                <div className="absolute left-0 top-1/2 w-1.5 h-1.5 bg-royal-gold rounded-full transform -translate-y-1/2 animate-pulse"></div>
                <div className="absolute right-0 top-1/2 w-1.5 h-1.5 bg-royal-gold rounded-full transform -translate-y-1/2 animate-pulse"></div>
              </div>
            </div>
            
            {/* Symbol between brains */}
            <div className="flex items-center justify-center">
              <Zap className="w-8 h-8 text-royal-gold animate-pulse" />
            </div>
            
            {/* Brain 2 */}
            <div className="relative w-24 h-24 animate-float animate-spin" style={{animationDelay: '1s', animationDuration: '25s', animationDirection: 'reverse'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-royal-purple to-royal-gold rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-royal-purple to-royal-gold animate-brain-glow flex items-center justify-center">
                <Brain className="w-12 h-12 text-white animate-neural-pulse" />
              </div>
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '14s', animationDirection: 'reverse'}}>
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-royal-purple rounded-full transform -translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-royal-purple rounded-full transform -translate-x-1/2 animate-pulse"></div>
                <div className="absolute left-0 top-1/2 w-1.5 h-1.5 bg-royal-purple rounded-full transform -translate-y-1/2 animate-pulse"></div>
                <div className="absolute right-0 top-1/2 w-1.5 h-1.5 bg-royal-purple rounded-full transform -translate-y-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-3 md:px-6 py-10 md:py-20">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Built for the next generation of AI interactions
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            {
              icon: Zap,
              title: "Dual LLM Power",
              description: "Harness multiple AI models simultaneously for superior responses and accuracy."
            },
            {
              icon: Bot,
              title: "Optimized Responses",
              description: "Advanced algorithms select the best answer from multiple AI sources."
            },
            {
              icon: MessageSquare,
              title: "Seamless Chat",
              description: "Intuitive conversation interface with real-time streaming responses."
            },
            {
              icon: Brain,
              title: "Custom Agents",
              description: "Create specialized AI agents tailored to your specific needs and workflows."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card group hover:scale-105 transition-all duration-300 animate-fade-up p-4 md:p-6"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className="h-10 md:h-12 w-10 md:w-12 text-royal-gold mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-foreground">{feature.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 md:py-8 border-t border-border/50 px-3 md:px-6">
        <p className="text-sm md:text-base text-muted-foreground">
          Developed by Panendra Sufiyan Thanuj and Varun.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
