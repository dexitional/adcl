import moment from 'moment'
import React from 'react'
import Logo from '../public/logo.png'
export default function Receipt({title = 'RECEIPT', cart, oid, date, className = 'hidden' }:any) {
  //cart && alert(JSON.stringify(cart))
  return (
    <>
    <div className={`${className} print:flex print:max-w-sm flex-col w-full max-w-sm my-2 rounded border border-slate-400 bg-white`}>
        <div className="border-b border-slate-400 py-3 flex items-center space-x-3">
            <img src={Logo.src} loading="lazy" className="w-24 h-24 ml-1" />
            <div className="flex-1 flex flex-col justify-center space-y-1">
                <span className="text-[1.4rem] font-semibold tracking-wider">KUUKUA STORES</span>
                <span className="text-xs font-medium">Telephone: +233(054) 043 8290</span>
                <span className="text-xs font-medium">Mobile: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+233(026) 928 5774</span>
                <span className="text-xs font-medium">Address: &nbsp;&nbsp;&nbsp;&nbsp;P.O Box 409, Cape Coast.</span>
                <span className="text-xs font-medium">TIN No   : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GHA 323343435-0</span>
                <span className="text-xs font-medium">Date: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ date || moment().format('LL')}</span>
                <span className="text-xs font-medium">Receipt #: &nbsp;&nbsp;{oid}</span>
                
            </div>
        </div>
        <div className="py-1">
            <div className="border-b border-slate-400 mb-3 pb-2 text-md font-semibold tracking-widest flex items-center justify-center">{title}</div>
            <div className="px-3 grid grid-cols-5 gap-1 text-[0.7rem] font-bold">
               <span className="col-span-2">Product</span>
               <span className="col-span-1">Quantity</span>
               <span className="col-span-1">Price</span>
               <span className="col-span-1">Amount</span>
            </div>
            <div className="p-3 ">
              { cart?.map((row:any) => (
                <div key={row.id} className="pb-2 grid grid-cols-5 gap-x-1 text-xs font-light">
                  <span className="col-span-2">{row.title}</span>
                  <span className="col-span-1">{row.quantity}</span>
                  <span className="col-span-1">{row.price && parseFloat(row.price).toFixed(2)}</span>
                  <span className="col-span-1">{(parseFloat(row.price) * parseFloat(row.quantity)).toFixed(2)}</span>
                </div>
              ))}
            </div>
           
        </div>
        <div className="pt-2 border-t border-slate-400">
            <div className="flex items-center justify-center space-x-5 text-md font-bold">
                <span>Total:</span>
                <span>GHC {cart.reduce((sum: number,cur:any) => sum+(parseFloat(cur.price) * parseInt(cur.quantity)), 0)}</span>
            </div>
            <div className="w-full border-b flex items-center justify-center"><span className="text-center text-[10px] font-semibold">( VAT Inclusive )</span></div>
            <div className="w-full my-2 flex items-center justify-center">
               <span className="text-center text-[10px] font-normal">We deal in all kinds of building materials!</span>
            </div>
            <div className="w-full my-1 pt-1 border-t flex items-center justify-center">
               <span className="text-center text-[10px] font-semibold">Developed by K-Soft GH - 0558641826</span>
            </div>
        </div>
    </div>
    </>
  )
}
