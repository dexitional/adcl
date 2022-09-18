import React from 'react'

export default function Stockline({data,setAction}: any) {
  return (
  <div className="print:p-0 print:m-0 print:bg-white print:drop-shadow-none print:space-x-0 print:border-0 relative flex items-center justify-center px-10 py-4 space-x-6 rounded border w-full max-w-xl my-10 mx-auto bg-slate-100/20 drop-shadow-sm">
    <div className="py-1 px-3 absolute -top-8 flex justify-between space-x-10 rounded-t-md bg-blue-900/90 text-slate-100 text-sm font-semibold ">
        <span>STOCK: 232343242342</span>
        <button onClick={()=> setAction(null)} className="m-0.5 px-2 py-0.5 rounded-sm text-blue-900/90 text-xs bg-slate-200">BACK</button>
    </div>
    <div className="print:hidden flex flex-col">
     
    </div>
  </div>
  )
}
