import React, { useEffect, useState } from 'react'
import PagerNew from '../PagerNew'
import Table from '../Table'
import { TbTrashX, TbEdit, TbTruckReturn } from 'react-icons/tb'
import { VscLayersActive,VscDiffAdded,VscDiffRemoved } from 'react-icons/vsc'
import { HiPrinter } from 'react-icons/hi'
import { FcApproval } from 'react-icons/fc'
import { useUserStore } from '../../utils/store'
import axios from 'axios';
import Router, { useRouter } from 'next/router'
import Notiflix from 'notiflix'
import moment from 'moment'
import Printout from './Printout'
import Orderline from './Orderline'
import Logo from '../../public/loader.gif'

const data = [];
export default function SaleList({ orders,saleType,setPage,setId,limit }: any) {
  const [ action, setAction ] = useState<any>(null);
  const [ activity, setActivity ] = useState<any>({});
  
  const router = useRouter()
  const { siteid } = useUserStore(state => state)

  const delRecord = async (id:string) => {
    const ok = window.confirm("Delete Record ?")
    if(ok){
      const res  = await axios.delete('/api/orders/'+id)
      if(res.data.success){
        router.reload();
        Notiflix.Notify.success('DELETED SUCCESSFULLY!');
      }
    }
  }

  const printOrder = async (id:string) => {
    setActivity({ ...activity, [id]: true })
    const res  = await axios.get('/api/orders/'+id)
    if(res.data.success){
      useUserStore.setState({ receipt: res.data.data })
      setAction('printout');
      setActivity({ ...activity, [id]: false })
    }
  }

  const viewOrder = (id:string) => {
    setAction('history');
  }

  const approveOrder = async (id:string) => {
    const data = { action: 'approve', order: id }
    const res  = await axios.post('/api/orderaction', data)
    if(res.data.success){
      Notiflix.Notify.success('ORDER APPROVED !');
      router.reload();
    }else{
      Notiflix.Notify.info('ORDER UNAPPROVED !');
    }
  }

  const returnOrder = async (id:string) => {
    const data = { action: 'return', order: id }
    const ok = window.confirm(" Return Sold Order ?")
    if(ok){
      const res  = await axios.post('/api/orderaction', data)
      if(res.data.success){
        Notiflix.Notify.success('ORDER RETURNED !');
        router.reload();
      } else{
        Notiflix.Notify.info('ORDER NOT RETURNED !');
      }
    }
  }

  useEffect(() => {
    siteid && router.push(`?siteid=${siteid}&limit=${limit}&page=1`)
  },[siteid])

  if(action == 'printout') return <Printout setAction={setAction} />
  if(action == 'history') return <Orderline orders={[]} setAction={setAction} />
  return (
    <>
    <PagerNew setPage={setPage} result={orders} limit={limit} />
    <Table
        header={
        <div className="gap-y-1 gap-x-2 grid grid-cols-7 text-center">
            <span className="col-span-1 text-left">Branch</span>
            <span className="col-span-1">Order Number</span>
            <span className="col-span-1">Order Amount</span>
            <span className="col-span-1">Order Date</span>
            <span className="col-span-1">Order Type</span>
            <span className="col-span-1">Served By</span>
            <span className="col-span-1">
            { saleType == 'daily' && <span className="p-1 px-2 w-36 inline-block border border-slate-400 bg-slate-100 text-slate-600 text-[0.65rem] uppercase font-semibold rounded">{moment().format('MMM DD')}|<b>GHC {orders.reduce((acc:number,cur:any) => acc+parseFloat(cur.amount),0)}</b></span> }
            </span>
        </div>
        }>

        <div className="gap-y-4 gap-x-2 grid grid-cols-7 text-center">
            { orders.map(( row:any, i:React.Key ) => (
            <React.Fragment key={i}>
            <span className="col-span-1 font-medium text-left">{row.branch}</span>
            <span className="col-span-1 font-medium">{row.oid}</span>
            <span className="col-span-1 font-medium">GHC <b className="font-bold">{row.amount}</b></span>
            <span className="col-span-1 text-center">{moment(row.created_at).format("LL")}</span>
            <span className="col-span-1 font-bold text-center">
              { row.approval == 0 && <span className='flex items-center justify-center py-0 p-0.5 rounded border '>{row.ordertype == 'normal' ? 'Cash Sale':'Credit Sale'}</span> }
              { row.approval == 1 && <span className="flex items-center justify-center py-0 p-0.5 rounded border border-green-600">{row.ordertype == 'normal' ? 'Cash Sale':'Credit Sale'}</span> }
              { row.approval == 2 && <span className='flex items-center justify-center py-0 p-0.5 rounded border border-yellow-600'>{row.ordertype == 'normal' ? 'Cash Sale':'Credit Sale'}</span> }
            </span>
            <span className="col-span-1 font-medium text-xs text-center">{row.user}</span>
            <span className="col-span-1">
               <div className="flex items-center justify-center space-x-1 space-y-1 flex-wrap sm:flex-nowrap">
                  <button title="Print Receipt" className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    { !activity[`${row._id}`] && <HiPrinter onClick={() => printOrder(row._id)} className="h-4 w-4 text-gray-700" /> }
                    { activity[`${row._id}`] && <span className="h-5 w-5"><img src={Logo.src} className="w-5 h-4 object-contain" /></span> }
                  </button>
                  
                  { saleType == 'credit' && row.approval == 0 &&
                  <button title="Approve Credit Order" className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <FcApproval onClick={() => approveOrder(row._id)} className="h-6 w-6 text-gray-700" />
                  </button>
                  }
                  { ( (saleType == 'completed' || saleType == 'daily') && row.approval == 1) &&
                  <button title="Return Order" className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <TbTruckReturn onClick={() => returnOrder(row._id)} className="h-4 w-4 text-gray-700" />
                  </button>
                  }

                  {/* Order History - In timeline from [ create, delete, return ] */}
                  <button className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <VscLayersActive onClick={() => viewOrder(row._id)} className="h-4 w-4 text-gray-700" />
                  </button>
                  {/*
                  <button onClick={() => editRecord(row._id)} className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <TbEdit className="h-4 w-4 text-green-500"/>
                  </button>
                  */}
                   
                  <button onClick={() => delRecord(row._id)} className="p-1 px-1.5 rounded border border-slate-300 bg-slate-50/90">
                    <TbTrashX className="h-4 w-4 text-red-500" />
                  </button>
                 {/**/}
                  
               </div>
            </span>
            </React.Fragment>
        ))}
        </div>
    </Table>
    </>
  )
}
