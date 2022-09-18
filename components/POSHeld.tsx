import React from 'react'
import { BsPerson,BsTrashFill } from 'react-icons/bs'
import { GrResume } from 'react-icons/gr'
import Logo from '../public/logo.png'


export function IconProfile({id,title,tag,deleteFromHeld,resumeFromHeld }: any){
    return (
        <div className="flex items-center flex-wrap justify-between px-4 py-3">
            <div className="flex-1 flex items-center space-x-3">
                <button onClick={()=> deleteFromHeld(id)} className="w-7 h-7 p-1.5 flex items-center justify-center bg-red-50 border rounded-full text-[10px] text-red-400 font-bold"><BsTrashFill className="w-5 h-5" /></button>
                <div className="flex-1">
                  <h3 className="text-[0.93rem] text-slate-900 font-medium">{title}</h3>
                  <p className="text-sm text-slate-600 font-normal"> {tag} </p>
                </div>
            </div>
            <div className="flex items-center space-x-1">
                <button onClick={()=> resumeFromHeld(id)} className="p-1 px-3 bg-slate-50 border rounded-full text-[10px] text-green-600 font-bold"><GrResume className="w-5 h-5" /></button>
            </div>
           
        </div>
    )
}

export function NoData(){
  return (
      <div className="flex items-center justify-between px-4 py-10 cursor-pointer">
          <div className="flex-1 flex flex-col items-center justify-center">
              <img src={Logo.src}  className="h-32 w-32 opacity-20" />
              <p className="text-xs text-gray-300 font-semibold">NO HELD ORDER SESSIONS</p>
          </div>
      </div>
  )
}

export default function POSHeld({ held, deleteFromHeld,resumeFromHeld }: any) {
  return (
    <div className="divide-y divide-slate-200">
      { held.map((row: any, i:React.Key ) => (
        <IconProfile key={row.tag} id={i} title={row.title} tag={`GHC ${row.cart.reduce((sum: number,cur:any) => sum+(parseFloat(cur.price) * parseInt(cur.quantity)), 0)} | ${row.tag || row.title}`} deleteFromHeld={deleteFromHeld} resumeFromHeld={resumeFromHeld} />
      ))}
      { (!held || held.length <= 0) && <NoData />}
    </div>
  )
}
