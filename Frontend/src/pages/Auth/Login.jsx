/* eslint-disable no-unused-vars */
import { use, useContext, useState } from "react"
import { assets } from "../../assets/assets"
import { data, useNavigate } from "react-router-dom"
import { AppContext } from "../../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"

const Login = () => {

    const navigate = useNavigate()

    const {backendUrl,setIsLoggedin,getUserData} = useContext(AppContext)

    const [state,setState]=useState('Sign Up')
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    const onSubmitHandle = async(e)=>{
        
        try{
            e.preventDefault()

            axios.defaults.withCredentials = true
            
            if(state === "Sign Up"){
               const {data} =  await axios.post(backendUrl + "/api/auth/register", 
                    {name,email,password}
                )
                
                if (data.success){
                    setIsLoggedin(true)
                    getUserData()
                    navigate("/")
                }else{
                    
                    toast.error(data.message)
                }
            }else{
                
                const {data} =  await axios.post(backendUrl + "/api/auth/login", 
                    {email,password}
                )
                console.log(data)
                if (data.success){
                    setIsLoggedin(true)
                    getUserData()
                    navigate("/")
                }else{
                    console.log("error1")
                    toast.error(data.message)
                }
            }
        }catch(error){
            toast.error(data.message)
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 
                    sm:px-0 bg-gradient-to-b from-stone-100 to-emerald-50">
      <img onClick={()=>navigate("/")} src={assets.agridust_logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"/>
      <div className="bg-white/95 backdrop-blur p-10 rounded-2xl shadow-xl w-full sm:w-96 text-slate-700 text-sm border border-emerald-100">
        <h2 className="text-3xl font-semibold text-slate-900 text-center mb-2">{state === "Sign Up"?'Create Account':"Welcome back"}</h2>
        <p className="text-center text-xs mb-6 text-slate-500">{state === "Sign Up"?'Join AgriDust to cultivate insights':"Sign in to continue growing"}</p>

        <form onSubmit={onSubmitHandle}>
            {state==="Sign Up" && (
                <div className='mb-4 flex flex-center gap-3 w-full px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors focus-within:ring-4 focus-within:ring-emerald-500/15'>
                <img src={assets.person_icon} alt="" className="w-5 h-5 opacity-70"/>
                <input value={name} onChange={e=>setName(e.target.value)} className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full" type="text" placeholder="Full Name"required/>
            </div>
            )}

            <div className='mb-4 flex flex-center gap-3 w-full px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors focus-within:ring-4 focus-within:ring-emerald-500/15'>
                <img src={assets.mail_icon} alt="" className="w-5 h-5 opacity-70"/>
                <input  value={email} onChange={e=>setEmail(e.target.value)}  className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full" type="email" placeholder="Email address"required/>
            </div>

            <div className='mb-4 flex flex-center gap-3 w-full px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors focus-within:ring-4 focus-within:ring-emerald-500/15'>
                <img src={assets.lock_icon} alt="" className="w-5 h-5 opacity-70"/>
                <input  value={password} onChange={e=>setPassword(e.target.value)}  className="bg-transparent outline-none text-slate-900 placeholder-slate-400 w-full" type="password" placeholder="Password"required/>
            </div>

            <p className="mb-4 text-emerald-700 hover:text-emerald-800 cursor-pointer" onClick={()=>navigate("/reset-password")}>Forgot Password</p>
 
            <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-600/20 transition-colors text-white font-medium">{state}</button>
        </form>

        {state === "Sign Up"? (
            <p className="text-slate-500 text-center text-xs mt-4">Already have an account?{' '}
            <span className="text-emerald-700 hover:text-emerald-800 cursor-pointer underline" onClick={()=>setState('Login')}>Login here</span>
        </p>
        )
        :(
            <p className="text-slate-500 text-center text-xs mt-4">Don't have an account?{' '}
            <span className="text-emerald-700 hover:text-emerald-800 cursor-pointer underline"  onClick={()=>setState('Sign Up')}>Sign up here</span>
        </p>
        )}

        

        

      </div>
    </div>
  )
}

export default Login
