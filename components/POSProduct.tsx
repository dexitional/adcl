import React from 'react'
import { BsPerson,BsGear } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'


export function IconProfile({ title,price,quantity,onClick,cart }: any){
    const isChosen = cart.find((c:any) => c.title.toLowerCase() == title.toLowerCase())
    return (
        <div className={`flex items-center justify-between px-4 py-3 cursor-pointer ${isChosen && 'bg-green-50'}`}>
            <div className="flex space-x-3">
                {/*<Icon className="h-6 w-6 text-slate-600" />*/}
                <div>
                    <h3 className="text-[0.93rem] text-slate-900 font-medium">{title}</h3>
                    <p className="text-sm text-slate-600 font-normal">GHC {price} | Q'ty: {quantity}</p>
                </div>
            </div>
            { !isChosen && <button onClick={onClick} className="p-1 px-2 bg-slate-50 border rounded-md text-[10px] text-slate-600 font-bold">ADD</button> }
        </div>
    )
}

export function NoData(){
    return (
        <div className="flex items-center justify-between px-4 py-3 cursor-pointer">
            <div className="flex space-x-3">
                {/*<Icon className="h-6 w-6 text-slate-600" />*/}
                <div>
                    <h3 className="text-[0.93rem] text-slate-900 font-medium">NO SEARCH RESULTS !!</h3>
                    <p className="text-sm text-slate-600 font-normal">Please type keywords to search products ...</p>
                </div>
            </div>
        </div>
    )
}

export default function POSProduct({ stocks,addToCart,cart }: any) {
  
  return (
    <div className="h-96 overflow-scroll divide-y divide-slate-200">
        { stocks?.map((row: any, i: React.Key) => (
         <IconProfile key={row._id} id={row._id} title={row.product} price={row.price} quantity={row.quantity} onClick={() => (row.quantity != 0 && row.price != 0) && addToCart(row._id,row.product,row.price,1)} cart={cart} />
        ))}
     
        { (!stocks || stocks.length <= 0) && <NoData />}

    </div>
  )
}
