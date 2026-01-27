import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"

export default function Sidebar() {

const { user } = useContext(AuthContext)

return (
<div style={{
width: "220px",
height: "100vh",
background: "#111827",
color: "white",
padding: "20px"
}}>

<h2>My Home</h2>

<p><Link to="/" style={{color:"white"}}>Dashboard</Link></p>
<p><Link to="/leads" style={{color:"white"}}>Leads</Link></p>
<p><Link to="/properties" style={{color:"white"}}>Properties</Link></p>

{user?.role === "Owner" && (
<p><Link to="/users" style={{color:"white"}}>Users</Link></p>
)}

<p>Finance</p>
<p>Analytics</p>

</div>
)
}
