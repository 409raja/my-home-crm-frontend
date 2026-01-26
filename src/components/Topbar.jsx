import { useContext } from "react"
import { AuthContext } from "../AuthContext"

export default function Topbar() {

  const { user, logout } = useContext(AuthContext)

  return (
    <div style={{
      padding: 10,
      borderBottom: "1px solid #ccc",
      display: "flex",
      justifyContent: "space-between"
    }}>

      <div>
        Logged in as: {user.name} ({user.role})
      </div>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  )
}
