import moment from 'moment'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Table from '../components/Table'
import { client } from '../sanity'
import { useUserStore } from '../utils/store'
import Login from './login'
import { Chart } from "react-google-charts";

const Report = ({data}:any) => {
   const { siteid,user } = useUserStore(state => state)
   const { weeksale,monthsale,yearsale } = data;
   const router = useRouter()
   const [chartData, setChartData] = useState<any>({ week:[], month:[], year:[] });
  
   const getChartData = () => {
    var dt = [["Weekday", "Sales"]];
    const dm = weeksale && Object.entries(weeksale)
    if(dm && dm.length > 0){
      dm.map(([key,value]: any) => {
        dt.push([moment(key,'DD-MM-YYYY').format('dddd').toUpperCase()+` -- GHC ${value.toFixed(2)}`,value])
      })
      setChartData({...chartData, week:dt })
    }

   
    var mt = [["Monthday", "Sales"]];
    const mm = Object.entries(monthsale)
    if(mm && mm.length > 0){
       mm.map(([key,value]: any) => {
         mt.push([moment(key,'DD-MM-YYYY').format('DD-MMM').toUpperCase(),value])
       })
      setChartData({...chartData, month:mt })
    }
   }

  
   useEffect(() => {
     siteid && router.push('?siteid='+siteid)
     getChartData()
   },[siteid])
   return (
     <Layout title="Report">
       <div>
         <div>
            {/*
            <div className="flex space-x-2">
               <span className="p-1 px-3 bg-slate-50 border rounded-full">1</span>
               <span>2</span>
               <span>3</span>
            </div>
            */}
            <div>
               
               {/*
               <div>1 - Report ||  All Monthly Sales for Current Year</div>
               <div>2 - Report || Overview Reports [ total stock products by branches | 10 most sold stocks |</div>
               <div>3 - Report || </div>
               */}
              {chartData.week.length > 0 && 
              <div> {/* WEEKLY SALES */}
                  <span className="block py-2 px-6 rounded-md border-2 bg-gray-100 text-gray-500 tracking-wider font-bold">SALES THIS WEEK | [ {moment().startOf('week').format('MMMM YYYY').toUpperCase()} - {moment().endOf('week').format('MMMM YYYY').toUpperCase()}]</span>
                  { chartData.week && (
                    <Chart
                      key={`week`}
                      chartType="PieChart"
                      data={chartData.week}
                      options={{ is3D: true }}
                      width={"100%"}
                      height={"400px"}
                    />
                  )}
               </div>
               }

               {chartData.month.length > 0 && 
               <div> {/* MONTHLY SALES */}
                  <span className="block py-2 px-6 rounded-md border-2 bg-gray-100 text-gray-500 tracking-wider font-bold">SALES THIS MONTH  | {moment().format('MMMM YYYY').toUpperCase()}</span>
                  { chartData.month && (
                    <Chart
                      key={`month`}
                      chartType="LineChart"
                      data={chartData.month}
                      options={{ is3D: true }}
                      width={"100%"}
                      height={"400px"}
                    />
                  )}
               </div>
               }
            </div>
         </div>
       </div>
     </Layout>
  )
}

export default Report



export async function getServerSideProps(context:any){
   //const { siteid } = useUserStore(state => state)
   let {siteid } = context.query;
   //let siteid = null
   let query = ``
   var results;
   const weekStartDate = moment().startOf('week')
   const weekEndDate = moment().endOf('week')
   const monthStartDate = moment().startOf('month')
   const monthEndDate = moment().endOf('month')
   const yearStartDate = moment().startOf('year')
   const yearEndDate = moment().endOf('year')
   query = `
    {
     "weeksale": *[_type == "order"  && completed == 1 && (dateTime(_createdAt) >= dateTime($weekStartDate) && dateTime(_createdAt) <= dateTime($weekEndDate)) ]{_id,amount,oid,ordertype,approval,"branch":siteid->title,"user":user->name,created_at },
     "monthsale": *[_type == "order"  && completed == 1 && (dateTime(_createdAt) >= dateTime($monthStartDate) && dateTime(_createdAt) <= dateTime($monthEndDate)) ] | order(created_at asc){_id,amount,oid,ordertype,approval,"branch":siteid->title,"user":user->name,created_at },
     "yearsale": *[_type == "order"  && completed == 1 && (dateTime(_createdAt) >= dateTime($yearStartDate) && dateTime(_createdAt) <= dateTime($yearEndDate))] | order(created_at asc){_id,amount,oid,ordertype,approval,"branch":siteid->title,"user":user->name,created_at }
    }
   `
   results = await client.fetch(query,{ weekStartDate,weekEndDate,monthStartDate,monthEndDate,yearStartDate,yearEndDate });
   //console.log(weekStartDate,weekEndDate,query,results,siteid)
   if(results?.weeksale && results?.weeksale?.length > 0){
      var weekResult:any = {};
      for(var sale of results?.weeksale){
         const key = moment(sale.created_at).format('DD-MM-YYYY')
         if(weekResult[key]){
            weekResult[key] = (parseFloat(weekResult[key])+parseFloat(sale.amount))
         }else{
            weekResult[key] = parseFloat(sale.amount)
         }
      }
      console.log(weekResult)
      results = {  ...results, weeksale: weekResult }
   }
   if(results?.monthsale && results?.monthsale?.length > 0){
      var monthResult:any = {};
      for(var sale of results?.monthsale){
         const key = moment(sale.created_at).format('DD-MM-YYYY')
         if(monthResult[key]){
            monthResult[key] = (parseFloat(monthResult[key])+parseFloat(sale.amount))
         }else{
            monthResult[key] = parseFloat(sale.amount)
         }
      }
      results = {  ...results, monthsale: monthResult }
   }

   if(!results) return { props: { data: {}}}
   return {
      props: {
         data: results
      }
   }
 
   
 
 
 }
