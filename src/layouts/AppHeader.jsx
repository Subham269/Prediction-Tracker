import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignUp} from './SignUp.jsx'
import {Login} from './Login.jsx'
import {useAuth} from '@/context/AuthContext.jsx'

function AppHeader()
{
    const {user,logout} = useAuth();
    const [authModal,setAuthModal] = useState(null);
    return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center font-bold text-lg">
        Prediction<span className="text-[#06A248]">OS</span>
        </div>
      {!user  ? (<div className="grid-cols-2 space-y-2">
        <Button className="bg-[#06A248] hover:bg-[#058a3d] text-white" onClick={()=> setAuthModal("signUp")}>
          Sign Up
        </Button>

        <Button className="bg-[#06A248] hover:bg-[#058a3d] text-white" onClick={()=> setAuthModal("login")}>
          Login
        </Button>
      </div>) 
      : (
        <div>
              <span>{user.username}</span>

              <button onClick={logout}>
              Logout
              </button>
        </div>
      )
      }
      <SignUp authModal={authModal}
      setAuthModal={setAuthModal} 
      />

      <Login authModal={authModal}
      setAuthModal={setAuthModal} 
      />

    
    </header>
    );
}

export default AppHeader 
