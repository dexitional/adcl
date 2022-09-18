import { EventHandler } from '@sanity/types/node_modules/@types/react';
import axios, { AxiosError } from 'axios';
import Error from 'next/error';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React,{ useState} from 'react'
import { FcShop } from 'react-icons/fc';
import { useUserStore } from '../utils/store';

export default function Login() {
  
  const [ form, setForm ]  = useState({ username:'', password:'' })
  const [ loading, setLoading ] = useState(false);
  const [ msg, setMsg ] = useState('');
  const router = useRouter();
  const fetchHelpers = useUserStore((state) => state.fetchHelpers);
  
  const onChange = (e:any) => {
     setForm({ ...form,[e.target.name]:e.target.value })
  }
  const authenticate = async (e:any) => {
      e.preventDefault();
      setLoading(true)
      const { username,password } = form;
      try{
          /*
        setTimeout(() => {
           setMsg('Connection timeout, check network !')
           setLoading(false);
           setForm({ username:'', password:'' })
        }, 10000)
        */

        const res = await axios.post('/api/auth',{ username,password })
        const user = res.data.data;
        useUserStore.setState({user, siteid: user.siteid })
        fetchHelpers()
        router.push('/home')
        setLoading(false)

      } catch (e){
        setMsg(`Wrong username or password !`);
        setTimeout(() => setMsg(''), 2000)
        setLoading(false)
        console.log(e)
      }
      
  }
  return (
    <div className="w-screen h-screen pb-20 flex flex-col justify-center bg-white">
        <div className="w-full mx-auto h-5 flex flex-row items-center justify-between py-3 bg-slate-50 border-b-[0.5px] border-solid border-gray-200/50">
            
            <div className="">
                <Link href="">
                    <span className="hidden py-2 px-4 rounded-md bg-blue-900 font-medium text-white">Home Page</span>
                </Link>
            </div>
        </div>
        <div className="w-screen h-screen py-10 flex justify-center bg-white">
            <div className="w-full mt-10 p-4 max-w-[370px]">
                <div className="w-full p-6 border bg-slate-50 border-gray-400/90 rounded-md">
                    <form className="flex flex-col space-y-8">
                        <div className="px-4 py-1 flex space-x-2 items-center justify-center text-lg tracking-widest font-bold text-blue-900 bg-white shadow-sm shadow-blue-900 rounded-full">
                            <FcShop className="h-8 w-8"/>
                            <span>ADCL STORE</span>
                        </div>
                        <div className="my-4">
                            <h4 className="text-md text-blue-900 font-verdana font-medium">Sign in to Kuukua POS</h4>
                        </div>
                        <div className="flex flex-col space-y-3">
                            { msg && (
                            <div className="my-1">
                                <h4 className="px-4 py-2 rounded border border-red-500 text-sm text-red-500 font-verdana font-medium">{msg}</h4>
                            </div>
                            )}
                            <input placeholder="Username" type="text" name="username" onChange={onChange} className="py-2 px-4 w-full border text-gray-700 font-light placeholder:text-gray-500 placeholder:font-light border-gray-400/90 rounded-[5px] outline-none" />
                            <input placeholder="Password" type="password" name="password" onChange={onChange} className="py-2 px-4 w-full border text-gray-700 font-light placeholder:text-gray-500 placeholder:font-light border-gray-400/90 rounded-[5px] outline-none" />
                            <button onClick={authenticate} disabled={loading} className="py-3 px-4 w-full bg-blue-900/90 text-white text-md font-medium rounded-[5px]" type="submit">{loading ? 'Authenticating ...':'Log In'}</button>
                        </div>
                        <Link href=""><span className="mt-4 text-sm text-center text-blue-900/90 hover:underline decoration-blue-900/90 cursor-pointer">Having trouble logging in?</span></Link>
                    
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
