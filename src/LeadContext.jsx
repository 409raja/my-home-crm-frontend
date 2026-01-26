import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const LeadContext = createContext()

export function LeadProvider({ children }) {

  const [leads, setLeads] = useState([])

  useEffect(() => {
    fetchLeads()
  }, [])

const fetchLeads = async () => {
try{

const user = JSON.parse(localStorage.getItem("user"))

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
  alert("Server waking up... please wait 30 seconds then refresh.")
  console.log(err)
  }
  }

  return (
    <LeadContext.Provider value={{ leads, setLeads, fetchLeads }}>
      {children}
    </LeadContext.Provider>
  )
}
