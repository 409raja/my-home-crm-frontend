export default function StatCard({ title, value }) {
  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 8,
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      minWidth: 180
    }}>
      <p style={{ color: "#555" }}>{title}</p>
      <h2>{value}</h2>
    </div>
  )
}
