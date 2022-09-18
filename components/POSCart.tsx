import React,{useState,useEffect} from 'react'
import { BsPerson,BsTrashFill } from 'react-icons/bs'
import { BiPlusCircle,BiMinusCircle } from 'react-icons/bi'
import Logo from '../public/logo.png'

export function IconProfile({ id,title,price,quantity,deleteFromCart,updateCartItem, className="" }: any){
    const [ qty,setQty ] = useState<number>(quantity);
    const decreaseItem = () => {
       let nqty = Math.max(1,qty-1);
       setQty(nqty)
       //updateCartItem(id,nqty)
    }
    const increaseItem = () => {
       let nqty = Math.max(1,qty+1);
       setQty(nqty)
       updateCartItem(id,nqty)
    }

    useEffect(() => {
       updateCartItem(id,qty)
    },[qty])

    return (
        <div className={`${className} flex items-center justify-between px-4 py-3`}>
            <div className="flex-1 flex space-x-3 items-center">
                <button onClick={()=> deleteFromCart(id)} className="w-7 h-7 p-1.5 flex items-center justify-center bg-red-50 border rounded-full text-[10px] text-red-400 font-bold"><BsTrashFill className="w-5 h-5" /></button>
                {/*<Icon className="h-6 w-6 text-slate-600" />*/}
                <div className="flex-1">
                    <h3 className="text-[0.93rem] text-slate-900 font-medium">{title}</h3>
                    <p className="text-sm text-slate-600 font-normal">GHC {price} </p>
                </div>
            </div>
            <div className="flex items-center space-x-1">
                <button onClick={increaseItem} className="p-0.5 bg-slate-50 border rounded-full text-[10px] text-green-600 font-bold"><BiPlusCircle className="w-5 h-5" /></button>
                <span className="p-0.5 px-1 bg-slate-50 border rounded-md text-xs text-slate-600 font-bold">{qty}</span>
                <button onClick={decreaseItem} className="p-0.5 bg-slate-50 border rounded-full text-[10px] text-red-600 font-bold"><BiMinusCircle className="w-5 h-5" /></button>
            </div>
           
        </div>
    )
}

export function NoData(){
    return (
        <div className="flex items-center justify-between px-4 py-3 cursor-pointer">
            <div className="flex-1 flex flex-col items-center justify-center">
                <img src={Logo.src}  className="h-32 w-32 opacity-20" />
                <p className="text-xs text-gray-300 font-semibold">No items in cart !!!</p>
            </div>
        </div>
    )
}

export default function POSCart({ cart,deleteFromCart,updateCartItem }: any) {
  return (
    <div className="divide-y divide-slate-200">
        { cart?.map((row: any, i: React.Key) => 
        i == cart.length - 1 ?
         (<IconProfile id={row.id} title={row.title} price={row.price} quantity={row.quantity} deleteFromCart={deleteFromCart} updateCartItem={updateCartItem} className="bg-yellow-50" />)
        :(<IconProfile id={row.id} title={row.title} price={row.price} quantity={row.quantity} deleteFromCart={deleteFromCart} updateCartItem={updateCartItem} />)
        )}

       { (!cart || cart.length <= 0) && <NoData />}
    </div>
  )
}
