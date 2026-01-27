
import { useEffect, useState } from "react"
import axios from "axios"

export default function Users(){

const [form,setForm]=useState({
name:"",
email:"",
password:"",
role:"Agent"
})

const create = async ()=>{
await axios.post("https://my-home-crm-backend.onrender.com/api/auth/create",form)
alert("User created")
setForm({name:"",email:"",password:"",role:"Agent"})
}

const [users,setUsers]=useState([])

useEffect(()=>{
axios.get("https://my-home-crm-backend.onrender.com/api/auth/users")
.then(res=>setUsers(res.data))
},[])

const disableUser = async(id)=>{
await axios.put(`https://my-home-crm-backend.onrender.com/api/auth/disable/${id}`)
setUsers(users.map(u=>u._id===id?{...u,active:false}:u))
}

const deleteUser = async(id)=>{
if(!window.confirm("Delete user?")) return
await axios.delete(`https://my-home-crm-backend.onrender.com/api/auth/${id}`)
setUsers(users.filter(u=>u._id!==id))
}

return(
<div style={{padding:20}}>
<h2>Create User</h2>

<input placeholder="Name"
value={form.name}
onChange={e=>setForm({...form,name:e.target.value})}
/><br/><br/>

<input placeholder="Email"
value={form.email}
onChange={e=>setForm({...form,email:e.target.value})}
/><br/><br/>

<input placeholder="Password"
value={form.password}
onChange={e=>setForm({...form,password:e.target.value})}
/><br/><br/>

<select
value={form.role}
onChange={e=>setForm({...form,role:e.target.value})}
>
<option>Agent</option>
<option>Manager</option>
<option>Accountant</option>
</select><br/><br/>

<button onClick={create}>Create User</button>

<h2>Employees</h2>

<input placeholder="Search employee..." onChange={e=>{
setUsers(users.filter(u=>u.name.toLowerCase().includes(e.target.value.toLowerCase())))
}}/>

<table width="100%" border="1" cellPadding="10">
<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Role</th>
<th>Action</th>
<th>Emp ID</th>
<th>Joined</th>

</tr>
</thead>

<tbody>
{users.map(u=>(
<tr key={u._id}>
<td>{u.name}</td>
<td>{u.email}</td>
<td>{u.role}</td>
<td>
<button onClick={()=>deleteUser(u._id)}>Delete</button>
</td>
<td>{u.empId}</td>
<td>{new Date(u.createdAt).toLocaleDateString()}</td>
<td>
{u.active ? (
<button onClick={()=>disableUser(u._id)}>Disable</button>
) : "Disabled"}
</td>

</tr>
))}
</tbody>
</table>

</div>
)
}
