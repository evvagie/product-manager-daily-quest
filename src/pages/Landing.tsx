import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#0400ff]/20 to-purple-600/20 border border-[#0400ff]/30 rounded-full text-[#0400ff] text-sm font-medium mb-6">
                Product Management Simulation
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900 whitespace-nowrap">
              Yuno <span className="bg-gradient-to-r from-[#0400ff] to-purple-600 bg-clip-text text-transparent">how to think</span> like a PM.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              An interactive online simulation designed to teach decision-making as a 
              product manager through immersive scenarios and branching choices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="bg-gradient-to-r from-[#0400ff] to-purple-600 hover:from-[#0300cc] hover:to-purple-700 !text-white px-8 py-4 text-lg font-medium shadow-lg animate-[pulse_1.5s_ease-in-out_infinite]" style={{
                color: 'white !important'
              }} onClick={() => navigate('/signup')}>
                Get Started →
              </Button>
              <Button variant="outline" size="lg" className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50 px-8 py-4 text-lg font-medium" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>

            {/* Pricing Invitation */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Want to see all features and pricing options?
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/pricing')}
                className="border-[#0400ff]/30 text-[#0400ff] hover:bg-[#0400ff]/5 px-6 py-2"
              >
                View Pricing Plans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
              Master PM Skills Through <span className="bg-gradient-to-r from-[#0400ff] to-purple-600 bg-clip-text text-transparent">Interactive Challenges</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-8 text-center hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0400ff]/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">4 Daily Challenges</h3>
                <p className="text-gray-600">Interactive mini-challenges that simulate real PM scenarios with drag & drop, timers, and decision trees.</p>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-8 text-center hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0400ff]/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">XP & Progression</h3>
                <p className="text-gray-600">Level up your PM skills with XP points, streaks, and achievements that track your learning journey.</p>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-8 text-center hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0400ff]/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Personalized Learning</h3>
                <p className="text-gray-600">Get tailored feedback and resources based on your performance to improve specific PM competencies.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            Ready to Think Like a Product Manager?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of aspiring PMs who are mastering product management through interactive simulations.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-[#0400ff] to-purple-600 hover:from-[#0300cc] hover:to-purple-700 !text-white px-12 py-4 text-lg font-medium shadow-lg animate-[pulse_1.5s_ease-in-out_infinite]" style={{
          color: 'white !important'
        }} onClick={() => navigate('/signup')}>
            Start Learning Today →
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
