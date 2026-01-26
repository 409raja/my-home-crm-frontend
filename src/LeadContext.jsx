import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const LeadContext = createContext()

export function LeadProvider({ children }) {

  const [leads, setLeads] = useState([])

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    //const res = await axios.get("http://localhost:5000/api/leads")
    const user = JSON.parse(localStorage.getItem("user"))

        const res = await axios.get("https://my-home-crm-backend.onrender.com/api/leads",{
        params:{
        role:user.role,
        name:user.name
        }
        })

    setLeads(res.data)
  }

  return (
    <LeadContext.Provider value={{ leads, setLeads, fetchLeads }}>
      {children}
    </LeadContext.Provider>
  )
}
