import React, { ReactHTMLElement } from 'react'
import Footer from './Footer'
import Header from './Header'
import { RiDoorOpenLine } from 'react-icons/ri'
import { useUserStore } from '../utils/store'
import SideMenu from './SideMenu'

export default function POSLayout({ children, openStore, title }: any) {
  const helper = useUserStore(state => state.helper); 
  return (
    <div className="print:hidden w-full flex flex-col justify-start bg-slate-50/90">
        <Header />
        <div className="flex m-0 p-0">
            <div className="sm:hidden">
             <SideMenu title={title?.toLowerCase()}/>
            </div>
            <div className="w-full">
               <div className="relative flex-1 m-2 p-2 sm:m-6 sm:p-6 rounded-md drop-shadow-sm bg-white border-[0.5px] border-gray-200">
                  {children}
                  <div className={`${helper?.sale && 'hidden'} absolute top-0 left-0 z-10 bg-blue-200/70 pt-36 sm:pt-0 w-full h-full flex items-start sm:items-center justify-center`}>
                    {/* Start Button */}
                     <button onClick={openStore} className="fixed py-2 px-4 rounded-md border-2 border-blue-700 bg-blue-400 text-blue-900 text-md font-semibold flex space-x-3 items-center">
                       <RiDoorOpenLine className="h-5 w-5" />
                       <span>OPEN DAILY SALES BOOK</span>
                     </button>
                  </div>
               </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}
