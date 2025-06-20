
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Header = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-300 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate(user ? '/dashboard' : '/')}
        >
          <div className="flex items-center">
            <span className="text-[#0400ff] font-bold text-xl sm:text-2xl">Yuno</span>
            <svg 
              width="32" 
              height="16" 
              viewBox="0 0 40 20" 
              className="ml-2 w-8 h-4 sm:w-10 sm:h-5"
            >
              <path 
                d="M2 10 L8 10 L10 5 L12 15 L14 8 L16 12 L18 10 L38 10" 
                stroke="#0400ff" 
                strokeWidth="2" 
                fill="none"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/pricing')}
            className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent font-medium hover:from-orange-600 hover:to-purple-700 text-sm sm:text-base hidden sm:inline-flex"
          >
            Pricing
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-gray-600 text-sm sm:text-base hidden sm:inline">Welcome back!</span>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="bg-white border-black text-black hover:bg-black hover:text-white font-normal hover:font-bold transition-all duration-200 text-sm sm:text-base px-3 sm:px-4"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-black font-medium text-sm sm:text-base"
              >
                Log In
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium !text-white text-sm sm:text-base px-3 sm:px-6"
                style={{ color: 'white !important' }}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
