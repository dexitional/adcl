import type { NextPage } from 'next'
import DashLayout from '../components/DashLayout'
import MenuIcon from '../components/MenuIcon'
import {FcHome,FcBarChart,FcViewDetails,FcSupport,FcUnlock,FcShipped,FcSafe,FcMoneyTransfer,FcFilingCabinet,FcDepartment,FcDebt,FcConferenceCall,FcCurrencyExchange,FcFactory,FcPaid} from 'react-icons/fc'
import { FiLogOut } from 'react-icons/fi';
import { useUserStore } from '../utils/store';

const Home: NextPage = () => {
  const { showSidebar,helper,siteid,user } = useUserStore(state => state);
  
  return (
     <DashLayout title="Home">
        <h3 className="my-2 mb-4 px-4 py-2 tracking-widest indent-7 text-gray-500 text-md font-semibold bg-slate-50 rounded-md">USER MENUS</h3>
        <div className="mb-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
             <MenuIcon title="HOME" Icon={FcHome} url="/home" />
             <MenuIcon title="POS" Icon={FcPaid} url="/pos" />
             { ['sales'].includes(user?.role?.toLowerCase()) && <MenuIcon title="DAILY SALE" Icon={FcMoneyTransfer} url="/dailysale" /> }
             { ['admin','owner'].includes(user?.role?.toLowerCase()) && 
             <>
             <MenuIcon title="PRODUCT" Icon={FcFilingCabinet} url="/product" />
             <MenuIcon title="STOCK" Icon={FcShipped} url="/stock" />
             {/*<MenuIcon title="STOCKLOG" Icon={FcSafe} url="/stocklog" />
             <MenuIcon title="WAREHOUSE" Icon={FcFactory} url="/warehouse" />*/}
             <MenuIcon title="DAILY SALE" Icon={FcMoneyTransfer} url="/dailysale" />
             <MenuIcon title="COMPLETE SALE" Icon={FcMoneyTransfer} url="/completesale" />
             <MenuIcon title="CREDIT SALE" Icon={FcCurrencyExchange} url="/creditsale" />
             <MenuIcon title="RETURN SALE" Icon={FcDebt} url="/returnsale" />
             <MenuIcon title="BRANCH" Icon={FcDepartment} url="/branch" />
             {/*<MenuIcon title="SETTINGS" Icon={FcSupport} url="/setting" />*/}
             <MenuIcon title="USER ACCOUNT" Icon={FcConferenceCall} url="/user" />
             {/*<MenuIcon title="USER LOG" Icon={FcViewDetails} url="/userlog" />*/}
             <MenuIcon title="REPORT" Icon={FcBarChart} url="/report" />
             <MenuIcon title="LOG OUT" Icon={FiLogOut} url="" />
             </>
             }
        </div>

        {/*<h3 className="my-2 mb-4 px-4 py-2 tracking-widest indent-7 text-gray-500 text-md font-semibold bg-slate-50 rounded-md">OVERVIEW</h3>*/}
        <div className="">
            {/* Most recent sales */}
            {/* 10 Most Reduced Stock  */}
            {/* 10 Most Sold Stock */ }
        </div>
     </DashLayout>
  )
}

export default Home
