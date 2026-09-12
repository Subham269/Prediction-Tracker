import {useContext, useState, createContext} from 'react'

const AuthContext = createContext();

export function AuthProvider({children}) 
{
    const [token,setToken] = useState(localStorage.getItem(token) || null);
    const [user,setUser] = useState(localStorage.getItem(user) ||null);

    const login = (token,user) => {
        setToken(token)
        setUser(user)
        localStorage.setItem(token)
        localStorage.setItem(user)
    }

    const logout = (token,user) => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(token)
    localStorage.removeItem(user)
    }
    return (
        <AuthContext.Provider value = {{token, user, login , logout}}>
            {children}
        </AuthContext.Provider>
    )
     
}

export function useAuth() 
{
    return useContext(AuthContext)
}