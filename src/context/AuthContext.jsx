import {useContext, useState, createContext} from 'react'

const AuthContext = createContext();

export function AuthProvider({children}) 
{
    const [token,setToken] = useState(localStorage.getItem("token") || null);
    const [user,setUser] = useState(()=>  {const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null});
    const [authModal,setAuthModal] = useState(null);

    const login = (token,user) => {
        setToken(token)
        setUser(user)
        localStorage.setItem('token',token)
        localStorage.setItem('user',JSON.stringify(user))
    }

    const logout = (token,user) => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(token)
    localStorage.removeItem(user)
    }
    return (
        <AuthContext.Provider value = {{token, user, login , logout,  authModal, setAuthModal}}>
            {children}
        </AuthContext.Provider>
    )
     
}

export function useAuth() 
{
    return useContext(AuthContext)
}