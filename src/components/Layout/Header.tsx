
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
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <span className="text-white font-bold text-xl">Yuno</span>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome back!</span>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="border-gray-600 text-white hover:bg-gray-800"
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
