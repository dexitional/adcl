import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React,{useState,useEffect} from 'react'
import ProductForm from '../components/form/ProductForm'
import Layout from '../components/Layout'
import ProductList from '../components/list/ProductList'
import { client } from '../sanity';

const Product: NextPage = ({products}: any) => {
  
  const [ page, setPage ] = useState('list');
  const router = useRouter()

  const SwitchPage = () => {
     switch(page) {
        case 'list': return <ProductList products={products} setPage={setPage}/>; break;
        case 'add': return <ProductForm setPage={setPage}  page={page} />; break;
        case 'edit': return <ProductForm setPage={setPage}  page={page} />; break;
        default: return <ProductList products={products} setPage={setPage} />
     }
  }

  return (
     <Layout title="Product">
        { SwitchPage()}
     </Layout>
  )
}

export default Product


export async function getServerSideProps(context:any){
   
   const { page,search } = context.query;
   let lastId = null
   let query = ``
   var results;

   if (search && search !== ''){ 
      query = `*[_type == "product" && title match $search]{_id,title,price,description,quantity,_createdAt } | order(_id) [0...100]`
      results = await client.fetch(query,{ search });
   
   } else if (!lastId){ 
      query = `*[_type == "product"]{_id,title,price,description,quantity,_createdAt } | order(_id) [0...100]`
      results = await client.fetch(query,{ lastId });
   
   }else{
      query = `*[_type == "product" && _id > $lastId]{_id,title,price,description,quantity,_createdAt } | order(_id) [0...100]`
      results = await client.fetch(query,{ lastId });
   }
   
   console.log(results,page,search)
   
   if(!results) return { props: { products: []}}
   if (results.length > 0)  lastId = results[results.length - 1]._id
   return {
      props: {
         products: results
      }
   }
 
   


}
