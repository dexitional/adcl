import moment from 'moment'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout'
import SaleList from '../components/list/SaleList'
import { client } from '../sanity';
import { groq } from 'next-sanity';

const DailySale: NextPage = ({ orders }: any) => {
  const [ page, setPage ] = useState('list');
  const [ id, setId ] = useState(null);
  const router = useRouter()

  const SwitchPage = () => {
     switch(page) {
        case 'list': return <SaleList orders={orders} setPage={setPage} setId={setId} saleType="daily" />; break;
        default: return <SaleList orders={orders} setPage={setPage} setId={setId} saleType="daily" />
     }
  }

  return (
     <Layout title="Daily Sale">
        { SwitchPage()}
     </Layout>
  )
}

export default DailySale


export async function getServerSideProps(context:any){
   
   const { page,search } = context.query;
   let lastId = null
   let query = ``
   var results;

   if (search && search !== ''){ 
      query = groq`*[_type == "order" && completed == 1 && created_at == $today && oid match $search]{_id,amount,oid,ordertype,approval,"branch":siteid->title,"user":user->name,created_at } | order(oid desc) [0...100]`
      //query = groq`*[_type == "order" && completed == 1]{_id,amount,oid,ordertype,"branch":siteid->title,"user":user->name,created_at } | order(oid desc) [0...100]`
      results = await client.fetch(query,{ search,today: moment().format("YYYY-MM-DD") });
   
   } else if (!lastId){ 
      query = groq`*[_type == "order" && completed == 1 && created_at == $today]{_id,amount,oid,ordertype,approval,"branch":siteid->title,"user":user->name,created_at } | order(oid desc) [0...100]`
      //query = groq`*[_type == "order" && completed == 1]{_id,amount,oid,ordertype,"branch":siteid->title,"user":user->name,created_at } | order(_id desc) [0...100]`
      results = await client.fetch(query,{ lastId,today: moment().format("YYYY-MM-DD") });
   
   } else{
      query = groq`*[_type == "order"  && completed == 1 && created_at == $today]{_id,amount,oid,ordertype,approval,"branch":siteid->title,"user":user->name,created_at } | order(oid desc) [0...100]`
      //query = groq`*[_type == "order"  && completed == 1]{_id,amount,oid,ordertype,"branch":siteid->title,"user":user->name,created_at } | order(_id desc) [0...100]`
      results = await client.fetch(query,{ lastId, today: moment().format("YYYY-MM-DD") });
   }

   if(!results) return { props: { orders: []}}
   if (results.length > 0)  lastId = results[results.length - 1]._id

   return {
      props: {
         orders: results
      }
   }
}
