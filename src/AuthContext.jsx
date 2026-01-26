import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({ children }){

const [user,setUser]=useState(null)

useEffect(()=>{
const saved = localStorage.getItem("user")
if(saved) setUser(JSON.parse(saved))
},[])

const logout = ()=>{
localStorage.clear()
setUser(null)
}

return(
<AuthContext.Provider value={{user,setUser,logout}}>
{children}
</AuthContext.Provider>
)
}
