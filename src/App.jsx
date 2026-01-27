
import { useEffect } from "react"
import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import Dashboard from "./pages/Dashboard"
import Leads from "./pages/Leads"
import Properties from "./pages/Properties"
import Login from "./pages/Login"
import Accountant from "./pages/Accountant"
import { Routes, Route } from "react-router-dom"
import { LeadContext } from "./LeadContext"
import Enquiry from "./pages/Enquiry"
import Users from "./pages/Users"


function App() {
useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission()
  }
}, [])

const { leads } = useContext(LeadContext)
  const { user } = useContext(AuthContext)
useEffect(() => {

const today = new Date().toLocaleDateString("en-CA")

  const alreadyNotified = localStorage.getItem("reminder-" + today)

  if (alreadyNotified) return

  const count = leads.filter(
    l => l.followup === today && l.status !== "Closed" && l.status !== "Lost"
  ).length

  if (count > 0 && Notification.permission === "granted") {

    new Notification(`You have ${count} follow-ups today`)

    localStorage.setItem("reminder-" + today, "shown")
  }
}, [leads])


  if (!user) return <Login />

  // Accountant
  if (user.role === "Accountant") {
    return (
      <>
        <Topbar />
        <Accountant />
      </>
    )
  }

  // Agent
  if (user.role === "Agent") {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Topbar />
          <Leads />
        </div>
      </div>
    )
  }

  // Owner + Manager
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/enquiry" element={<Enquiry/>}/>
          <Route path="/users" element={<Users/>}/>
        </Routes>

      </div>
    </div>
  )
}

export default App
