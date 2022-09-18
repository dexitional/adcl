import React from 'react'
import PagerNew from '../PagerNew'
import Table from '../Table'
import { TbTrashX, TbEdit } from 'react-icons/tb'
import { MdPassword } from 'react-icons/md'
import { useUserStore } from '../../utils/store'
import axios from 'axios';
import Router, { useRouter } from 'next/router'
import Notiflix from 'notiflix'

export default function UserList({users,setPage}: any) {

  const router = useRouter()
  const delRecord = async (id:string) => {
    const ok = window.confirm("Delete Record ?")
    if(ok){
      const res  = await axios.delete('/api/users/'+id)
      if(res.data.success){
        router.push("?page=1")
        Notiflix.Notify.success('DELETED SUCCESSFULLY!');
      }
    }
  }

  const editRecord = (id:string) => {
     useUserStore.setState( { eid: id})
     setPage('edit')
  }

  const resetPass = async (id:string,phone: string) => {
    const ok = window.confirm("Reset Password ?")
    if(ok){
      const data = { action:'reset', user: id, phone }
      const res  = await axios.post('/api/account',data)
      if(res.data.success){
        Notiflix.Notify.success('ACCOUNT RESETTED!');
      }
    }
  }

  return (
    <>
    <PagerNew setPage={setPage} />
    <Table
        header={
        <div className="gap-y-1 gap-x-2 grid grid-cols-7">
            <span className="col-span-2">Full Name</span>
            <span className="col-span-1">Username</span>
            <span className="col-span-1">Mobile</span>
            <span className="col-span-1">Role</span>
            <span className="col-span-1">Branch</span>
            <span className="col-span-1">&nbsp;</span>
        </div>
        }>

        <div className="gap-y-4 gap-x-2 grid grid-cols-7 leading-[1.2rem]">
            { users?.map(( row:any, i:React.Key ) => (
            <React.Fragment key={i}>
            <span className="col-span-2 font-medium">{row.name}</span>
            <span className="col-span-1 font-medium">{row.username}</span>
            <span className="col-span-1"><b className="">{row.phone}</b></span>
            <span className="col-span-1">{row.role }</span>
            <span className="col-span-1 font-medium">{row.branch }</span>
            <span className="col-span-1">
            <div className="flex items-center justify-center space-x-1 space-y-1">
                  <button onClick={() => resetPass(row._id,row.phone)} className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <MdPassword className="h-4 w-4 text-yellow-600"/>
                  </button>
                  <button onClick={() => editRecord(row._id)} className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <TbEdit className="h-4 w-4 text-green-500"/>
                  </button>
                  <button onClick={() => delRecord(row._id)} className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <TbTrashX className="h-4 w-4 text-red-500" />
                  </button>
               </div>
            </span>
            </React.Fragment>
        ))}
        </div>
    </Table>
    </>
  )
}
