import React,{useState,useEffect} from 'react'
import PagerNew from '../PagerNew'
import Table from '../Table'
import { TbTrashX, TbEdit } from 'react-icons/tb'
import { VscLayersActive,VscDiffAdded,VscDiffRemoved } from 'react-icons/vsc'
import { useUserStore } from '../../utils/store'
import axios from 'axios';
import Router, { useRouter } from 'next/router'
import Notiflix from 'notiflix'
import Stockline from './Stockline'

export default function StockList({ stocks,setPage,setId }: any) {
  const [ action, setAction ] = useState<any>(null);
  const [ activity, setActivity ] = useState<any>({});
  const [ data, setData ] = useState<any>(null);
  
  const router = useRouter()

  const delRecord = async (id:string) => {
    const ok = window.confirm("Delete Record ?")
    if(ok){
      const res  = await axios.delete('/api/stocks/'+id)
      if(res.data.success){
        router.reload()
        Notiflix.Notify.success('DELETED SUCCESSFULLY!');
      }
    }
  }

  const editRecord = (id:string) => {
     useUserStore.setState( { eid: id})
     setId(id)
     setPage('edit')
  }

  const upgradeRecord = (id:string) => {
    useUserStore.setState( { eid: id })
    setPage('edit')
  }

  const incStock = async (id:string) => {
    const inp = window.prompt("Enter Stock Quantity to be Added !")
    if(inp && inp != ''){
       const data = { action: 'inc', quantity: Number(inp), product: id }
       const res  = await axios.post('/api/stockupdate', data)
       if(res.data.success){
         router.reload()
         Notiflix.Notify.success('STOCK INCREMENTED!');
       }
    }
  }

  const decStock = async(id:string) => {
    const inp = window.prompt("Enter Stock Quantity to be deducted !")
    if(inp && inp != ''){
       const data = { action: 'dec', quantity: Number(inp), product: id }
       const res  = await axios.post('/api/stockupdate', data)
       if(res.data.success){
         router.reload()
         Notiflix.Notify.success('STOCK DECREMENTED!');
       }
    }
  }

  const viewStock = async(id:string) => {
    const res = await axios.get('/api/stocklog/'+encodeURIComponent(id))
    if(res.status == 200){
      const data = res.data;
      if(data.success){
        console.log(data.data)
        setData(data.data)
        setAction('history')
      }
    }
    
  }

  if(action == 'history') return <Stockline data={[]} setAction={setAction} />
  return (
    <>
    <PagerNew setPage={setPage} />
    <Table
        header={
        <div className="gap-y-1 gap-x-2 grid grid-cols-6">
            <span className="col-span-2">Product Name</span>
            <span className="col-span-1">Product Price</span>
            <span className="col-span-1">Branch</span>
            <span className="col-span-1">Stock Quantity</span>
            <span className="col-span-1">&nbsp;</span>
        </div>
        }>

        <div className="gap-y-4 gap-x-2 grid grid-cols-6 leading-[1.2rem]">
            { stocks.map(( row:any, i:React.Key ) => (
            <React.Fragment key={i}>
            <span className="col-span-2 font-medium">{row.product}</span>
            <span className="col-span-1 font-medium">GHC <b className="font-bold">{row.price}</b></span>
            <span className="col-span-1 font-medium">{row.branch}</span>
            <span className="col-span-1 font-bold text-center">{row.quantity}</span>
            <span className="col-span-1">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                 <button className="p-1 px-1.5 rounded border border-slate-300 bg-green-50/90">
                    <VscDiffAdded onClick={() => incStock(row._id)} className="h-4 w-4 text-gray-900" />
                  </button>
                  <button className="p-1 px-1.5 rounded border border-slate-300 bg-red-50/90">
                    <VscDiffRemoved onClick={() => decStock(row._id)} className="h-4 w-4 text-gray-900" />
                  </button>
                  <button className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <VscLayersActive onClick={() => viewStock(row._id)} className="h-4 w-4 text-gray-700" />
                  </button>
                  {/*
                  <button className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <VscLayersActive onClick={() => upgradeRecord(row._id)} className="h-4 w-4 text-gray-700" />
                  </button>
                  */}
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
