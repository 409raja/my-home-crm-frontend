import { useContext } from "react"
import { LeadContext } from "../LeadContext"
import StatCard from "../components/StatCard"
import { AuthContext } from "../AuthContext"

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const { leads } = useContext(LeadContext)

  const today = new Date().toLocaleDateString("en-CA")

  const todayLeads = leads.filter(l => l.followup === today)

  const pendingLeads = leads.filter(
    l =>
      l.followup &&
      l.followup < today &&
      l.status !== "Closed" &&
      l.status !== "Lost"
  )

  const closedLeads = leads.filter(l => l.status === "Closed")
  const totalRevenue = closedLeads.reduce(
    (sum, l) => sum + (l.amount || 0),
    0
  )

  const sources = {}
  const agents = {}

  leads.forEach(l => {
    // ---------- SOURCES ----------
    if (!sources[l.source]) sources[l.source] = 0
    sources[l.source]++

    // ---------- AGENTS ----------
    const agentName = l.owner?.name || "Unassigned"

    if (!agents[agentName]) {
      agents[agentName] = {
        total: 0,
        followup: 0,
        closed: 0,
        lost: 0,
        revenue: 0
      }
    }

    agents[agentName].total++

    if (l.followup === today) {
      agents[agentName].followup++
    }

    if (l.status === "Closed") {
      agents[agentName].closed++
      agents[agentName].revenue += l.amount || 0
    }

    if (l.status === "Lost") {
      agents[agentName].lost++
    }
  })

  const conversion =
    leads.length === 0
      ? 0
      : Math.round((closedLeads.length / leads.length) * 100)

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 20 }}>
        <StatCard title="Total Leads" value={leads.length} />
        <StatCard title="Today Follow-ups" value={todayLeads.length} />
        <StatCard title="Closed Deals" value={closedLeads.length} />
        <StatCard title="Conversion %" value={`${conversion}%`} />

        {user.role === "Owner" && (
          <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
        )}
      </div>

      <h3 style={{ marginTop: 30 }}>🔔 Today Follow-ups</h3>

      {todayLeads.length === 0 && <p>No follow-ups today.</p>}

      {todayLeads.map((l, i) => (
        <div
          key={i}
          style={{ background: "#fff3cd", padding: 10, marginBottom: 10 }}
        >
          {l.client} – {l.property} (Agent: {l.owner?.name || "Unassigned"})
        </div>
      ))}

      {(user.role === "Owner" || user.role === "Manager") && (
        <>
          <h3 style={{ marginTop: 30, color: "red" }}>
            ⏳ Pending Follow-ups
          </h3>

          {pendingLeads.length === 0 && <p>No pending follow-ups 🎉</p>}

          {pendingLeads.map((l, i) => (
            <div
              key={i}
              style={{
                background: "#f8d7da",
                padding: 10,
                marginBottom: 10
              }}
            >
              {l.client} – {l.property} (Agent:{" "}
              {l.owner?.name || "Unassigned"}) | Due: {l.followup}
            </div>
          ))}
        </>
      )}

      <h3 style={{ marginTop: 40 }}>👥 Agent Performance</h3>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Total</th>
            <th>Follow-Up Today</th>
            <th>Closed</th>
            <th>Lost</th>
            <th>Revenue</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(agents).map((a, i) => (
            <tr key={i}>
              <td>{a}</td>
              <td>{agents[a].total}</td>
              <td>{agents[a].followup}</td>
              <td>{agents[a].closed}</td>
              <td>{agents[a].lost}</td>
              <td>₹{agents[a].revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 40 }}>📊 Lead Sources</h3>

      <table width="50%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Source</th>
            <th>Total Leads</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(sources).map((s, i) => (
            <tr key={i}>
              <td>{s}</td>
              <td>{sources[s]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
