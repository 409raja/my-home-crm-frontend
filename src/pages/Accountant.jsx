import { useContext } from "react"
import { LeadContext } from "../LeadContext"

export default function Accountant() {

  const { leads } = useContext(LeadContext)

  const closed = leads.filter(l => l.status === "Closed")

  const total = closed.reduce((s, l) => s + (l.amount || 0), 0)

  return (
    <div style={{ padding: 20 }}>

      <h2>Accountant Panel</h2>

      <h3>Total Revenue: ₹{total}</h3>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Client</th>
            <th>Property</th>
            <th>Agent</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {closed.map((l, i) => (
            <tr key={i}>
              <td>{l.client}</td>
              <td>{l.property}</td>
              <td>{l.owner}</td>
              <td>₹{l.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}
