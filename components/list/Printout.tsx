import moment from 'moment'
import React, { useEffect } from 'react'
import { useUserStore } from '../../utils/store'
import Receipt from '../Receipt'

export default function Printout({ setAction }: any) {
  const { receipt } = useUserStore(state=>state)
  useEffect(() => {
    //alert(JSON.stringify(receipt));
  },[])
  return (
    <div className="print:p-0 print:m-0 print:bg-white print:drop-shadow-none print:space-x-0 print:border-0 relative flex items-center justify-center px-10 py-4 space-x-6 rounded border w-full max-w-xl my-10 mx-auto bg-slate-100/20 drop-shadow-sm">
      <div className="py-1 px-6 absolute -top-7 rounded-t-md bg-blue-900/90 text-slate-100 text-sm font-semibold">ORDER NUMBER: {receipt?.oid}</div>
      <div className="print:hidden flex flex-col">
        <button onClick={()=> window.print()} className="px-4 py-1 bg-slate-800 border ring-2 ring-gray-800 rounded my-2 text-sm text-white font-semibold tracking-wide">PRINT</button>
        <button onClick={()=> setAction(null)} className="px-4 py-1 bg-slate-800 border ring-2 ring-gray-800 rounded my-2 text-sm text-white font-semibold tracking-wide">BACK</button>
      </div>
      <Receipt title="RECEIPT" cart={receipt?.cart} oid={receipt?.oid} date={moment(receipt?.created_at).format('LL')} className=""/>
    </div>
   )
}
