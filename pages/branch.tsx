import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React,{useState,useEffect} from 'react'
import BranchForm from '../components/form/BranchForm'
import Layout from '../components/Layout'
import BranchList from '../components/list/BranchList'
import { client } from '../sanity';

const Branch: NextPage = ({branches}: any) => {
  
  const [ page, setPage ] = useState('list');
  const [ id, setId ] = useState(null);
  const router = useRouter()

  const SwitchPage = () => {
     switch(page) {
        case 'list': return <BranchList branches={branches} setPage={setPage} setId={setId} />; break;
        case 'add': return <BranchForm setPage={setPage}  page={page} setId={setId} id={id} />; break;
        case 'edit': return <BranchForm setPage={setPage}  page={page}  setId={setId} id={id} />; break;
        default: return <BranchList branches={branches} setPage={setPage} setId={setId} />
     }
  }

  return (
     <Layout title="Branch">
        { SwitchPage()}
     </Layout>
  )
}
export default Branch

export async function getServerSideProps(context:any){
   
   const { page,search } = context.query;
   let lastId = null
   let query = ``
   var results;

   if (search && search !== ''){ 
      query = `*[_type == "siteid" && title match $search]{_id,title,location,description,status,_createdAt } | order(_created_at)) [0...100]`
      results = await client.fetch(query,{ search });
   
   } else if (!lastId){ 
      query = `*[_type == "siteid"]{_id,title,location,description,status,_createdAt } | order(_created_at) [0...100]`
      results = await client.fetch(query,{ lastId });
   
   }else{
      query = `*[_type == "siteid" && _id > $lastId]{_id,title,location,description,status,_createdAt } | order(_created_at) [0...100]`
      results = await client.fetch(query,{ lastId });
   }
   
   console.log(results,page,search)
   
   if(!results) return { props: { branches: []}}
   if (results.length > 0)  lastId = results[results.length - 1]._id
   return {
      props: {
         branches: results
      }
   }
 
   


}
