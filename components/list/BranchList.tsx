import React from 'react'
import PagerNew from '../PagerNew'
import Table from '../Table'
import { TbTrashX, TbEdit } from 'react-icons/tb'
import { VscLayersActive,VscDiffAdded,VscDiffRemoved } from 'react-icons/vsc'
import { useUserStore } from '../../utils/store'
import axios from 'axios';
import Router, { useRouter } from 'next/router'
import Notiflix from 'notiflix'

export default function BranchList({branches,setPage,setId}: any) {

  const router = useRouter()
  const delRecord = async (id:string) => {
    const ok = window.confirm("Delete Record ?")
    if(ok){
      const res  = await axios.delete('/api/branches/'+id)
      if(res.data.success){
        router.push("?page=1")
        Notiflix.Notify.success('DELETED SUCCESSFULLY!');
      }
    }
  }

  const editRecord = (id:string) => {
     useUserStore.setState( { eid: id })
     setId(id)
     setPage('edit')
  }
  return (
    <>
    <PagerNew setPage={setPage} />
    <Table
        header={
        <div className="gap-y-1 gap-x-2 grid grid-cols-5">
            <span className="col-span-2">Branch Name</span>
            <span className="col-span-1">Branch Location</span>
            <span className="col-span-1">Branch Description</span>
            <span className="col-span-1">&nbsp;</span>
        </div>
        }>

        <div className="gap-y-4 gap-x-2 grid grid-cols-5 leading-[1.2rem]">
            { branches.map(( row:any, i:React.Key ) => (
            <React.Fragment key={i}>
            <span className="col-span-2 font-bold">{row.title}</span>
            <span className="col-span-1 font-medium"><b className="font-semibold">{row.location}</b></span>
            <span className="col-span-1">{row.description || ' -- None --'}</span>
            <span className="col-span-1">
            <div className="flex items-center justify-center space-x-1 space-y-1">
                  <button onClick={() => editRecord(row._id)} className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <TbEdit className="h-4 w-4 text-green-500"/>
                  </button>
                 {/* 
                  <button onClick={() => delRecord(row._id)} className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <TbTrashX className="h-4 w-4 text-red-500" />
                  </button>
                 */}
               </div>
            </span>
            </React.Fragment>
        ))}
        </div>
    </Table>
    </>
  )
}
