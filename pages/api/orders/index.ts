// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { closeStore, createCart, createLog, createOrder, createOrderLog, createProduct, openStore, verifyUser } from '../../../utils/apiServer'
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
        const { ordertype,action } = req.body;
        let data;
        if(ordertype == 'normal'){
          req.body = { ...req.body, approval:1,completed:1, }
          data = await createOrder(req.body)
          if(data){
            //await createCart(data,req.body.cart)
            //await createLog({ create_request:req.body, order: data},"create cash order")
            //await createOrderLog(data,req.body)
          }
        }
        
        if(ordertype == 'credit'){
          req.body = { ...req.body, approval:0,completed:1, }
          data = await createOrder(req.body)
          if(data){
            createCart(data,req.body.cart)
            createLog({ create_request:req.body, order: data},"create credit order")
            createOrderLog(data,req.body)
          }
        }
        if(action == 'opensale'){
          createLog(req.body,"open sale")
          data = await openStore(req.body)
        }
        if(action == 'closesale'){
          createLog(req.body,"close sale")
          data = await closeStore(req.body)
        }
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
