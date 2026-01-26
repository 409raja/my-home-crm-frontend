import { useNavigate } from "react-router-dom"

export default function Properties() {

const navigate = useNavigate()

const properties = [
{ title: "2BHK Flat", location: "Whitefield", price: "35L", sqft: 1200, status: "Available", owner: "Ravi" },
{ title: "Villa", location: "Sarjapur", price: "90L", sqft: 2500, status: "Sold", owner: "Aman" }
]

return (
<div style={{ padding: 20 }}>
<h2>Properties</h2>

<table width="100%" border="1" cellPadding="10">
<thead>
<tr>
<th>Title</th>
<th>Location</th>
<th>Price</th>
<th>Sqft</th>
<th>Uploaded By</th>
<th>Status</th>
<th>Enquiry</th>
</tr>
</thead>

<tbody>
{properties.map((p, i) => (
<tr key={i}>

<td>{p.title}</td>
<td>{p.location}</td>
<td>{p.price}</td>
<td>{p.sqft}</td>
<td>{p.owner}</td>

<td>
<span style={{
padding:"4px 10px",
borderRadius:"10px",
color:"white",
background:p.status==="Available"?"green":"red"
}}>
{p.status}
</span>
</td>

<td>
<button
onClick={()=>navigate("/enquiry",{ state:{ property:p.title } })}
>
Enquire
</button>
</td>

</tr>
))}
</tbody>

</table>
</div>
)
}
