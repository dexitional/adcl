// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { changeUserPass, resetUserPass, upgradeStock } from '../../utils/apiServer'
import moment from 'moment'


export default async function Auth(
  req: NextApiRequest,
  res: NextApiResponse
) {
   const { method } = req

   /* POST SINGLE/MULTIPLE RECORDS */
   if(method == 'POST'){
      try{
         const { user,phone, action, password } = req.body;
         console.log(req.body)
         var result;
         if(action == 'reset'){
            result = await resetUserPass(user);
            const { password } = result;
         }
         if(action == 'change'){
            result = await changeUserPass(user,password);
         }
         const msg = `Hi! Your new password is ${password}`
         // sms(phone,msg)
         return res.status(200).json({success:true, msg });
         
      }catch(e){
         console.log(e)
         return res.status(500).json({success:false, data: null, msg: e});
      }
   }

   // DEFAULT HTTP VERBS ALLOWED
   res.setHeader('Allow', ['POST'])
   res.status(405).end(`Method ${method} Not Allowed`)
}
