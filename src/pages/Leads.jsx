

import axios from "axios"
import { useEffect, useContext, useState } from "react"
import { AuthContext } from "../AuthContext"
import { LeadContext } from "../LeadContext"

export default function Leads() {

const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
const [selected, setSelected] = useState([])

useEffect(() => {
  const resize = () => setIsMobile(window.innerWidth < 768)
  window.addEventListener("resize", resize)
  return () => window.removeEventListener("resize", resize)
}, [])

const { user } = useContext(AuthContext)
const { leads, setLeads, fetchLeads } = useContext(LeadContext)

const updateFollowup = (index, value) => {
  const copy = [...leads]
  copy[index].followup = value
  setLeads(copy)
  axios.put(`http://localhost:5000/api/leads/${l._id}`, copy[i])
}
const agents = ["Ravi","Aman","Suresh"]
const [newLead, setNewLead] = useState({
  client:"",
  phone:"",
  property:"",
  owner:user.name,
  status:"New",
  source:"Manual"
})

const addLead = async () => {
  await axios.post("http://localhost:5000/api/leads", newLead)
  fetchLeads()
}


return (
<div style={{ padding: 20 }}>
<h2>Leads</h2>

{(user.role==="Owner" || user.role==="Manager") && (
<button style={{marginBottom:10}} onClick={async ()=>{
if(selected.length===0) return alert("No leads selected")
if(!window.confirm("Delete selected leads?")) return

for(const id of selected){
await axios.delete(`http://localhost:5000/api/leads/${id}`)
}

setSelected([])
fetchLeads()
}}>
Delete Selected
</button>
)}


<div style={{marginBottom:20}}>
<input placeholder="Client" onChange={e=>setNewLead({...newLead,client:e.target.value})}/>
<input placeholder="Phone" onChange={e=>setNewLead({...newLead,phone:e.target.value})}/>
<input placeholder="Property" onChange={e=>setNewLead({...newLead,property:e.target.value})}/>
<select onChange={e=>setNewLead({...newLead,owner:e.target.value})}>
{agents.map(a=><option key={a}>{a}</option>)}
</select>

<button onClick={addLead}>Add Lead</button>
</div>

{/* DESKTOP TABLE */}
{!isMobile && (
<table width="100%" border="1" cellPadding="10">
<thead>
<tr>
<th>Client</th>
<th>Phone</th>
<th>Property</th>
<th>Owner</th>
<th>Status</th>
<th>Amount</th>
<th>Follow-up</th>
<th>Notes</th>
<th>Source</th>
<th>Select</th>

</tr>
</thead>

<tbody>
{leads
.filter(l => user.role === "Owner" || l.owner === user.name)
.map((l,i)=>(
<tr key={i}>

<td>{l.client}</td>
<td>{l.phone}</td>
<td>{l.property}</td>
<td>
<select value={l.owner} onChange={async e=>{
const updated={...l, owner:e.target.value}
await axios.put(`http://localhost:5000/api/leads/${l._id}`, updated)
fetchLeads()
}}>
{agents.map(a=><option key={a}>{a}</option>)}
</select>
</td>



<td>
<select value={l.status||"New"} onChange={e=>{
const copy=[...leads]
copy[i].status=e.target.value
setLeads(copy)
}}>
<option>New</option>
<option>Contacted</option>
<option>Visit</option>
<option>Closed</option>
<option>Lost</option>
</select>
</td>

<td>
{l.status==="Closed"?
<input value={l.amount||""} onChange={e=>{
const copy=[...leads]
copy[i].amount=Number(e.target.value)
setLeads(copy)
}}/>:"-"}
</td>

<td>
<input type="date" value={l.followup||""}
onChange={e=>updateFollowup(i,e.target.value)}/>
</td>

<td>
<input value={l.note||""} onChange={e=>{
const copy=[...leads]
copy[i].note=e.target.value
setLeads(copy)
}}/>
</td>

<td>{l.source}</td>
<td>
<input
type="checkbox"
checked={selected.includes(l._id)}
onChange={()=>{
setSelected(prev =>
prev.includes(l._id)
? prev.filter(id=>id!==l._id)
: [...prev,l._id]
)
}}
/>
</td>

</tr>
))}
</tbody>
</table>
)}

{/* MOBILE CARDS */}
{isMobile && leads
.filter(l => user.role === "Owner" || l.owner === user.name)
.map((l,i)=>(
<div key={i} style={{
border:"1px solid #ccc",
padding:12,
marginBottom:12,
borderRadius:10,
background:"#fff"
}}>

<b>{l.client}</b><br/>
Phone: 
Phone: 
<a href={`tel:${l.phone}`}>{l.phone}</a> |
<a
  href={`https://wa.me/91${l.phone}`}
  target="_blank"
>
  WhatsApp
</a>
<br/>

Property: {l.property}<br/>
Agent: {l.owner}<br/>
Source: {l.source}<br/><br/>

Status:
<select value={l.status||"New"} onChange={e=>{
const copy=[...leads]
copy[i].status=e.target.value
setLeads(copy)
}}>
<option>New</option>
<option>Contacted</option>
<option>Visit</option>
<option>Closed</option>
<option>Lost</option>
</select>

<br/><br/>

{l.status==="Closed" && (
<>
Amount:
<input value={l.amount||""} onChange={e=>{
const copy=[...leads]
copy[i].amount=Number(e.target.value)
setLeads(copy)
}}/>
<br/><br/>
</>
)}

Follow-up:
<input type="date" value={l.followup||""}
onChange={e=>updateFollowup(i,e.target.value)}/>

<br/><br/>

Notes:
<input value={l.note||""} onChange={e=>{
const copy=[...leads]
copy[i].note=e.target.value
setLeads(copy)
}}/>

</div>
))}

</div>
)
}
