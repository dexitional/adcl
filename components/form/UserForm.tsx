import axios from 'axios';
import React,{ useState, useEffect} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useUserStore } from '../../utils/store';

const styles = {
   wrapper : `flex flex-col space-y-10`,
   title: `text-lg text-slate-800 font-medium tracking-wider`,
   label: `flex-1 flex flex-col space-y-2`,
   labeltitle: `text-[0.8rem] font-medium text-slate-800`,
   input: `px-3 py-2 border rounded drop-shadow-sm outline-none text-slate-500 placeholder-slate-500`,
   select: `px-3 py-2 border rounded drop-shadow-sm outline-none text-slate-500 placeholder-slate-500`,
   option: `px-3 py-2 h-20 bg-white`,
   btncover: `my-3 px-4 py-4 rounded flex space-x-3 justify-end bg-slate-50`,
   btn: `px-4 py-1.5 rounded bg-slate-800 text-sm font-medium text-white`,
   fcover: `w-full flex items-center justify-between space-x-4`,
   inner: `w-full flex flex-col space-y-5`,

}

/*

_id: { type: Schema.Types.ObjectId, auto: true},
    vat: { type: Schema.Types.ObjectId, ref: 'Vat' },
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    title: { type: String, unique: true, required: true },
    description: String,
    sku: String,
    price:  { type: Number, default: 0.0 },
    cprice: { type: Number, default: 0.0 },
    quantity: { type: Number, default: 0 },
    min_quantity : { type: Number, default: 0 },
    status : { type: Number, default: 1 },
    created_at: { type: Date, default: new Date() },
    timestamp : { type: String, default: moment().format('LLL') },
    siteid : { type: Number, default: 1 },


*/


type Inputs = {
    name: string,
    username: string,
    phone: string,
    location: string,
    address: string,
    email: string,
    role: string,
    allow_access:number,
    branch:string
};


export default function ProductForm({ setPage,page }: any) {

    const { helper, eid } = useUserStore((state) => state );
    const fetchHelpers = useUserStore((state) => state.fetchHelpers);
    const { register, handleSubmit,getValues,setValue, formState: { errors } } = useForm<Inputs>();
  
    const loadRecord = async () => {
      const res = await axios.get('/api/users/'+eid);
      if(res.data.success){
          const dt = res.data.data[0]
          setValue('name', dt.name);
          setValue('username',dt.username);
          setValue('phone',dt.phone);
          setValue('location',dt.location);
          setValue('address',dt.address);
          setValue('email',dt.email);
          setValue('role',dt.role);
          setValue('allow_access', dt.allow_access);
          setValue('branch', dt.branchID);
         
      } 
    }
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
      let res;
      if(eid){
          res = await axios.put('/api/users/'+eid, data);
      }else{
          res = await axios.post('/api/users', data);
      }
      if(res.data.success){
         alert('Record Saved Successfully !')
         useUserStore.setState({ eid: null })
         setPage('list')
      } 
    }
    const cancelForm = (e: any) => {
        e.preventDefault()
        useUserStore.setState({ eid: null })
        setPage('list')
    }
  
    useEffect(() => {
      fetchHelpers();
      eid && loadRecord()
    },[])

  return (
    <div className={styles.wrapper}>
        <div>
            <h3 className={styles.title}>{page == 'edit' ? 'Edit':'Add'}  User</h3>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inner}>
                    <div className={styles.fcover}>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Full Name</span>
                            <input {...register("name",{ "required": true })} className={styles.input} />
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Username</span>
                            <input {...register("username",{ "required": true })} className={styles.input} />
                        </label>
                    </div>
                    <div className={styles.fcover}>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Mobile Number</span>
                            <input {...register("phone",{ "required": true })} className={styles.input} />
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Email Address</span>
                            <input {...register("email")} className={styles.input} />
                        </label>
                    </div>
                    <div className={styles.fcover}>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Location</span>
                            <input {...register("location",{ "required": true })} className={styles.input} />
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Address</span>
                            <input {...register("address")} className={styles.input} />
                        </label>
                    </div>
                    <div className={styles.fcover}>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Assigned Branch</span>
                            <select className={styles.select} {...register("branch",{ "required": true })}>
                                 <option className={styles.option} disabled selected>-- CHOOSE --</option>
                              { helper?.branches?.map((row:any,i:React.Key) => (
                                 <option key={i} value={row._id} className={styles.option}>{row.title.toUpperCase()}</option>
                              ))}
                            </select>
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>User Role</span>
                            <select className={styles.select} {...register("role",{ "required": true })}>
                                <option value={`owner`} className={styles.option}>Owner</option>
                                <option value={`admin`} className={styles.option}>Administrator</option>
                                <option value={`sales`} className={styles.option}>Sales Agent</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div className={styles.btncover}>
                    <button onClick={cancelForm} className={`${styles.btn} text-red-300 bg-red-50`}>Cancel</button>
                    <button type="submit" className={styles.btn}>Save</button>
                </div>
            </form>
        </div>
    </div>
  )
}
