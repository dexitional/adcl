// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser, verifyUser } from '../../../utils/apiServer'
import moment from 'moment'
var bcrypt = require('bcrypt');



export default async function StockApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
   const {
      method,
   } = req


   /* POST SINGLE/MULTIPLE RECORDS */
   if(method == 'POST'){
      try{
        const data = await createUser(req.body)
        return res.status(200).json({success:true, data });
      }catch(e){
        console.log(e)
        return res.status(500).json({success:false, data: null, msg: e});
      }
   }

   /* FETCH MULTIPLE RECORDS */
   if(method == 'GET'){

   }
}
