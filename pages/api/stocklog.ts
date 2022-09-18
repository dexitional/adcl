// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { upgradeStock } from '../../utils/apiServer'
import moment from 'moment'
var bcrypt = require('bcrypt');

export default async function Auth(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try{
       var data = await upgradeStock(req.body);
       return res.status(200).json({success:true, data });
        
    }catch(e){
       console.log(e)
       return res.status(500).json({success:false, data: null, msg: e});
    }
}
