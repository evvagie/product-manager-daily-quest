
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"

const Landing = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-[#0400ff]/20 border border-[#0400ff]/30 rounded-full text-[#0400ff] text-sm font-medium mb-6">
                Product Management Simulation
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Yuno <span className="text-[#0400ff]">how to think</span> like a PM.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              An interactive online simulation designed to teach decision-making as a 
              product manager through immersive scenarios and branching choices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-[#0400ff] hover:bg-[#0300cc] text-white px-8 py-4 text-lg font-medium"
                onClick={() => navigate('/signup')}
              >
                Get Started →
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-black border-white text-white hover:bg-gray-900 px-8 py-4 text-lg font-medium"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>

            {/* App Preview */}
            <div className="relative">
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-[#0400ff] to-purple-600 rounded-3xl border-8 border-gray-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                    <span className="text-3xl font-bold">Y</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Yuno</h3>
                  <p className="text-sm text-white/80">Think like a PM</p>
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <p className="text-gray-400 text-sm">Coming to your browser</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Master PM Skills Through <span className="text-[#0400ff]">Interactive Challenges</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gray-800/50 border-gray-700 p-8 text-center hover:bg-gray-800/70 transition-colors">
                <div className="w-16 h-16 bg-[#0400ff]/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">4 Daily Challenges</h3>
                <p className="text-gray-300">Interactive mini-challenges that simulate real PM scenarios with drag & drop, timers, and decision trees.</p>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 p-8 text-center hover:bg-gray-800/70 transition-colors">
                <div className="w-16 h-16 bg-[#0400ff]/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">XP & Progression</h3>
                <p className="text-gray-300">Level up your PM skills with XP points, streaks, and achievements that track your learning journey.</p>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 p-8 text-center hover:bg-gray-800/70 transition-colors">
                <div className="w-16 h-16 bg-[#0400ff]/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Personalized Learning</h3>
                <p className="text-gray-300">Get tailored feedback and resources based on your performance to improve specific PM competencies.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Think Like a Product Manager?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of aspiring PMs who are mastering product management through interactive simulations.
          </p>
          <Button 
            size="lg" 
            className="bg-[#0400ff] hover:bg-[#0300cc] text-white px-12 py-4 text-lg font-medium"
            onClick={() => navigate('/signup')}
          >
            Start Learning Today →
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Landing
