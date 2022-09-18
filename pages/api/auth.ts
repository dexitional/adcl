// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyUser } from '../../utils/apiServer'
import moment from 'moment'
var bcrypt = require('bcrypt');



export default async function Auth(
  req: NextApiRequest,
  res: NextApiResponse
) {

    const { username,password } = req.body;
    try{
        var user = await verifyUser({ username });
        //console.log("Passwords: ",bcrypt.hashSync(password,10),user.password)
        const match = bcrypt.compareSync(password, user.password);
       
        if(password && match){ console.log("MATCH",match,user)
            //const token = jwt.sign({data:user}, 'secret', { expiresIn: 60 * 60 });
            //user.token = token;
            //util.logwriter('LOGIN_SUCCESS',username,{username,password:user.password}) //LOG WRITER
            //req.session.user = user;
            return res.status(200).json({success:true, data: user});
            
        }else{
            //util.logwriter('LOGIN_FAILED',username,{ username,password }) //LOG WRITER
            return res.status(200).json({success:false, data: null, msg:"wrong username or password!"});
        }
    }catch(e){
        console.log(e)
        //util.logwriter('LOGIN_FAILED',username,{ username,password }) //LOG WRITER
        return res.status(500).json({success:false, data: null, msg: e});
    }


  res.status(200).json({ name: 'John Doe' })
}
