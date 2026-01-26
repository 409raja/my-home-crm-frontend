import { useState, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../AuthContext"

export default function Login(){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const { setUser } = useContext(AuthContext)

const login = async ()=>{
try{
const res = await axios.post("http://localhost:5000/api/auth/login",{email,password})
localStorage.setItem("token",res.data.token)
localStorage.setItem("user",JSON.stringify(res.data.user))
setUser(res.data.user)
}catch(err){
console.log(err)
alert("Login failed")
}

}

return(
<div style={{padding:40}}>
<h2>CRM Login</h2>

<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
<br/><br/>
<input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
<br/><br/>

<button onClick={login}>Login</button>
</div>
)
}
