import moment from 'moment'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout'
import SaleList from '../components/list/SaleList'
import { client } from '../sanity';

const CreditSale: NextPage = ({ orders }: any) => {
  
  const [ page, setPage ] = useState('list');
  const [ id, setId ] = useState(null);
  const router = useRouter()

  const SwitchPage = () => {
     switch(page) {
        case 'list': return <SaleList orders={orders} setPage={setPage} setId={setId} saleType="credit" />; break;
        default: return <SaleList orders={orders} setPage={setPage} setId={setId} saleType="credit" />
     }
  }

  return (
     <Layout title="Credit Sale">
        { SwitchPage()}
     </Layout>
  )
}

export default CreditSale


export async function getServerSideProps(context:any){
   
   const { page,search } = context.query;
   let lastId = null
   let query = ``
   var results;

   if (search && search !== ''){ 
      query = `*[_type == "order" && approval == 0 && oid match $search]{_id,amount,oid,ordertype,"branch":siteid->title,"user":user->name,created_at } | order(_id desc) [0...100]`
      results = await client.fetch(query,{ search });
   
   } else if (!lastId){ 
      query = `*[_type == "order" && approval == 0]{_id,amount,oid,ordertype,"branch":siteid->title,"user":user->name,created_at } | order(_id desc) [0...100]`
      results = await client.fetch(query,{ lastId });
      
   }else{
      query = `*[_type == "order"  && approval == 0]{_id,amount,oid,ordertype,"branch":siteid->title,"user":user->name,created_at } | order(_id desc) [0...100]`
      results = await client.fetch(query,{ lastId });
   }

   if(!results) return { props: { orders: []}}
   if (results.length > 0)  lastId = results[results.length - 1]._id
   return {
      props: {
         orders: results
      }
   }
}
