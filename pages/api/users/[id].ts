// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteProduct, deleteUser, fetchProduct, fetchUser, updateProduct, updateUser, verifyUser } from '../../../utils/apiServer'
import moment from 'moment'
var bcrypt = require('bcrypt');



export default async function StockApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
   const {
     query: { id, name },
     method,
   } = req
   
   /* LOAD SINGLE DATA */
   if(method == 'GET'){
      try{
         const data =  await fetchUser(id);
         return res.status(200).json({ success:true, data });
      }catch(e){
         console.log(e)
         return res.status(500).json({success:false, data: null, msg: e});
      }
   }

   /* DELETE SINGLE RECORD */
   if(method == 'DELETE'){
      try{
         const data =  await deleteUser(id);
         return res.status(200).json({ success:true, data });
      }catch(e){
         console.log(e)
         return res.status(500).json({success:false, data: null, msg: e});
      }
   }

   /* PATCH/UPDATE SINGLE RECORD */
   if(method == 'PUT'){
      try{
         const data =  await updateUser(id,req.body);
         return res.status(200).json({ success:true, data });
       }catch(e){
         console.log(e)
         return res.status(500).json({success:false, data: null, msg: e});
       }
   }

   // DEFAULT HTTP VERBS ALLOWED
   res.setHeader('Allow', ['GET', 'PUT','DELETE'])
   res.status(405).end(`Method ${method} Not Allowed`)

}
