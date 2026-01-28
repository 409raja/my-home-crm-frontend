

import axios from "axios"
import { useEffect, useContext, useState } from "react"
import { AuthContext } from "../AuthContext"
import { LeadContext } from "../LeadContext"

export default function Leads() {

const [isMobile, setIsMobile] = useState(false)
const [selected, setSelected] = useState([])

useEffect(() => {
  if (typeof window !== "undefined") {
    setIsMobile(window.innerWidth < 768)

    const resize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", resize)

    return () => window.removeEventListener("resize", resize)
  }
}, [])


const { user } = useContext(AuthContext)
const { leads, setLeads, fetchLeads } = useContext(LeadContext)

const updateFollowup = async (index,value)=>{
const copy=[...leads]
copy[index].followup=value
setLeads(copy)

await axios.put(
`https://my-home-crm-backend.onrender.com/api/leads/${copy[index]._id}`,
copy[index]
)
}
const [openNote,setOpenNote] = useState(null)
const [agents,setAgents] = useState([])
const [newLead, setNewLead] = useState({
  client:"",
  phone:"",
  property:"",
  owner:user.name,
  status:"New",
  source:"Manual"
})
useEffect(()=>{
axios.get("https://my-home-crm-backend.onrender.com/api/auth/users")
.then(res=>setAgents(res.data.filter(u=>u.role==="Agent")))
},[])

const addLead = async () => {
await axios.post("https://my-home-crm-backend.onrender.com/api/leads", newLead)

setNewLead({
client:"",
phone:"",
property:"",
owner:user.name,
status:"New",
source:"Manual"
})

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
await axios.delete(`https://my-home-crm-backend.onrender.com/api/leads/${id}`)

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
<select
value={newLead.owner}
onChange={e=>setNewLead({...newLead,owner:e.target.value})}
>

{agents.map(a=>(
<option key={a._id} value={a.name}>{a.name}</option>
))}
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
<select
value={l.owner}
onChange={async e=>{
const copy=[...leads]
copy[i].owner=e.target.value
setLeads(copy)

await axios.put(
`https://my-home-crm-backend.onrender.com/api/leads/${l._id}`,
copy[i]
)
}}

>
{agents.map(a=>(
<option key={a._id}>{a.name}</option>
))}
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

<td>
{l.source}

{l.note && (
<button
style={{marginLeft:5}}
onClick={()=>setOpenNote(l.note)}
>
👁
</button>
)}
</td>

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
phone: 
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

{openNote && (
<div style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"rgba(0,0,0,.5)",
display:"flex",
alignItems:"center",
justifyContent:"center"
}}>

<div style={{
background:"#fff",
padding:20,
maxWidth:500,
borderRadius:10
}}>

<h3>Lead Details</h3>

<pre style={{whiteSpace:"pre-wrap"}}>
{openNote}
</pre>

<button onClick={()=>setOpenNote(null)}>Close</button>

</div>
</div>
)}


</div>
)
}
