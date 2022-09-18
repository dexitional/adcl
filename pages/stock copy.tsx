import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React,{useState,useEffect} from 'react'
import StockForm from '../components/form/StockForm'
import Layout from '../components/Layout'
import StockList from '../components/list/StockList'
import { client } from '../sanity';

const Stock: NextPage = ({stocks}: any) => {
  
  const [ page, setPage ] = useState('list');
  const [ id, setId ] = useState(null);
  const router = useRouter()

  const SwitchPage = () => {
     switch(page) {
        case 'list': return <StockList stocks={stocks} setPage={setPage} setId={setId} />; break;
        case 'add': return <StockForm setPage={setPage} page={page} setId={setId} id={id}  />; break;
        case 'edit': return <StockForm setPage={setPage}  page={page} setId={setId} id={id}  />; break;
        default: return <StockList stocks={stocks} setPage={setPage} setId={setId} />
     }
  }

  return (
     <Layout title="Stock">
        { SwitchPage()}
     </Layout>
  )
}

export default Stock


export async function getServerSideProps(context:any){
   
   const { page,search } = context.query;
   let lastId = null
   let query = ``
   var results;

   if (search && search !== ''){ 
      query = `*[_type == "stock" && product->title match $search]{_id,"product":product->title,"price":product->price,quantity,"branch":siteid->title,_createdAt } | order(product->_id) [0...100]`
      results = await client.fetch(query,{ search });
   
   } else if (!lastId){ 
      query = `*[_type == "stock"]{_id,"product":product->title,"price":product->price,quantity,"branch":siteid->title,_createdAt } | order(product->_id) [0...100]`
      results = await client.fetch(query,{ lastId });
   
   }else{
      //query = `*[_type == "stock" && _id > $lastId]{_id,product->{title} as product,product->{price} as price,quantity,_createdAt } | order(_id) [0...100]`
      query = `*[_type == "stock"]{_id,"product":product->title,"price":product->price,quantity,"branch":siteid->title,_createdAt } | order(product->_id) [0...100]`
      results = await client.fetch(query,{ lastId });
   }
   
   console.log(results,page,search)
   
   if(!results) return { props: { stocks: []}}
   if (results.length > 0)  lastId = results[results.length - 1]._id
   return {
      props: {
         stocks: results
      }
   }
 
   


}
