import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React,{useState,useEffect} from 'react'
import UserForm from '../components/form/UserForm'
import Layout from '../components/Layout'
import UserList from '../components/list/UserList'
import { client } from '../sanity';

const User: NextPage = ({users}: any) => {
  
  const [ page, setPage ] = useState('list');
  const router = useRouter()

  const SwitchPage = () => {
     switch(page) {
        case 'list': return <UserList users={users} setPage={setPage}/>; break;
        case 'add': return <UserForm setPage={setPage}  page={page} />; break;
        case 'edit': return <UserForm setPage={setPage}  page={page} />; break;
        default: return <UserList users={users} setPage={setPage} />
     }
  }

  return (
     <Layout title="User">
        { SwitchPage()}
     </Layout>
  )
}

export default User


export async function getServerSideProps(context:any){
   
   const { page,search } = context.query;
   let lastId = null
   let query = ``
   var results;

   if (search && search !== ''){ 
      query = `*[_type == "user" && name match $search]{_id,name,username,phone,email,location,address,role,"branch":siteid->title,"branchID":siteid->_id,_createdAt } | order(role,title) [0...100]`
      results = await client.fetch(query,{ search });
   
   } else if (!lastId){ 
      query = `*[_type == "user"]{_id,name,username,phone,email,location,address,role,"branch":siteid->title,"branchID":siteid->_id,_createdAt } | order(role,title) [0...100]`
      results = await client.fetch(query,{ lastId });
   
   }else{
      query = `*[_type == "user" && _id > $lastId]{_id,name,username,phone,email,location,address,role,"branch":siteid->title,"branchID":siteid->_id,_createdAt } | order(role,title) [0...100]`
      results = await client.fetch(query,{ lastId });
   }
   
   console.log(results,page,search)
   
   if(!results) return { props: { users: []}}
   if (results.length > 0)  lastId = results[results.length - 1]._id
   return {
      props: {
         users: results
      }
   }
 
   


}
