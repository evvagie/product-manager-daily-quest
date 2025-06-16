
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
    <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate(user ? '/dashboard' : '/')}
        >
          <div className="flex items-center">
            <span className="text-[#0400ff] font-bold text-2xl">Yuno</span>
            <svg 
              width="40" 
              height="20" 
              viewBox="0 0 40 20" 
              className="ml-2"
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
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome back!</span>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="bg-black border-white text-white hover:bg-white hover:text-black font-normal hover:font-bold transition-all duration-200"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
