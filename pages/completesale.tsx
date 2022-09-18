import moment from 'moment'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout'
import SaleList from '../components/list/SaleList'
import { client } from '../sanity';

const CompleteSale: NextPage = ({ orders }: any) => {
  
  const [ page, setPage ] = useState('list');
  const [ id, setId ] = useState(null);
  const router = useRouter()

  const SwitchPage = () => {
     switch(page) {
        case 'list': return <SaleList orders={orders} setPage={setPage} setId={setId} saleType="completed" limit={3} />; break;
        default: return <SaleList orders={orders} setPage={setPage} setId={setId} saleType="completed" limit={3} />
     }
  }

  return (
     <Layout title="Complete Sale">
        { SwitchPage()}
     </Layout>
  )
}

export default CompleteSale

export async function 
getServerSideProps(context:any){
   const { search,siteid } = context.query;
   let query = ``
   var results;
   if(!siteid){
      return { props: { orders: []}}
   } else{
      if (search && search !== ''){ 
         query = `*[_type == "order" && completed == 1 && siteid._ref == $siteid && oid match $search]{_id,amount,oid,ordertype,approval,"branch":siteid->title,"user":user->name,created_at } | order(oid desc) [0...$limit]`
         results = await client.fetch(query,{ search,siteid  });
      }else{
         query = `*[_type == "order" && completed == 1 && siteid._ref == $siteid ]{_id,amount,oid,ordertype,approval,"branch":siteid->title,"user":user->name,created_at } | order(oid desc) `
         results = await client.fetch(query,{ siteid });
      }
      console.log(query);
      if(!results) return { props: { orders: []}}
      return {
         props: {
           orders: results
         }
      }
   }
}
