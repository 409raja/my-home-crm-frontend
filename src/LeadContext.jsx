import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const LeadContext = createContext()

export function LeadProvider({ children }) {

  const [leads, setLeads] = useState([])

  useEffect(() => {
  fetchLeads()

  const interval = setInterval(()=>{
  fetchLeads()
  },15000) // every 15 seconds

  return ()=>clearInterval(interval)

  }, [])


const fetchLeads = async () => {
try{

const user = JSON.parse(localStorage.getItem("user"))

if(!user) return

const res = await axios.get(
"https://my-home-crm-backend.onrender.com/api/leads",
{
params:{
role:user.role,
name:user.name
}
}
)

setLeads(res.data)

}catch(err){
console.log("Server waking up...", err.message)
}
}


  return (
    <LeadContext.Provider value={{ leads, setLeads, fetchLeads }}>
      {children}
    </LeadContext.Provider>
  )
}
