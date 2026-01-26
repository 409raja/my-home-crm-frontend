import { useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"

export default function Enquiry(){
const location = useLocation()
const selectedProperty = location.state?.property || ""

const [form,setForm]=useState({
client:"",
phone:"",
property:selectedProperty
})


const submit = async ()=>{
console.log("Submitting form:", form)

try{
const res = await axios.post("http://localhost:5000/api/leads",{
client: form.client,
phone: form.phone,
property: form.property,
owner:"Website",
status:"New",
source:"Website"
})

console.log("Saved:", res.data)

alert("Thank you! We will contact you.")

setForm({client:"",phone:"",property:""})

}catch(err){
console.error("Submit failed:", err)
alert("Submit failed – check console")
}
}

return(
<div style={{padding:40,maxWidth:400}}>
<h2>Property Enquiry</h2>

<input placeholder="Your Name"
value={form.client}
onChange={e=>setForm({...form,client:e.target.value})}
/><br/><br/>

<input placeholder="Phone"
value={form.phone}
onChange={e=>setForm({...form,phone:e.target.value})}
/><br/><br/>

<input placeholder="Property Interested"
value={form.property}
onChange={e=>setForm({...form,property:e.target.value})}
/><br/><br/>

<button onClick={submit}>Submit</button>

</div>
)
}
