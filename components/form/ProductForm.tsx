import axios from 'axios';
import React,{ useState, useEffect} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useUserStore } from '../../utils/store';
import Notiflix from 'notiflix';
import { useRouter } from 'next/router';

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
    title: string,
    description: string,
    price:number,
    status:number
};


export default function ProductForm({ setPage,page }: any) {

    const { helper, eid } = useUserStore((state) => state );
    const fetchHelpers = useUserStore((state) => state.fetchHelpers);
    const { register, handleSubmit,getValues,setValue, formState: { errors } } = useForm<Inputs>();
    const router = useRouter()

    const loadRecord = async () => {
      const res = await axios.get('/api/products/'+eid);
      if(res.data.success){
          const dt = res.data.data[0]
          setValue('title', dt.title);
          setValue('description',dt.description);
          setValue('price', dt.price);
          setValue('status', dt.status);
         
      } 
    }
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
      let res;
      if(eid){
          res = await axios.put('/api/products/'+eid, data);
      }else{
          res = await axios.post('/api/products', data);
      }
      if(res.data.success){
         Notiflix.Notify.success('SAVED SUCCESSFULLY!');
         useUserStore.setState({ eid: null })
         //setPage('list')
         router.push("")
      } 
    }
    const cancelForm = (e: any) => {
        e.preventDefault()
        useUserStore.setState({ eid: null })
        setPage('list')
    }
  
    useEffect(() => {
      eid && loadRecord()
    },[])

  return (
    <div className={styles.wrapper}>
        <div>
            <h3 className={styles.title}>{page == 'edit' ? 'Edit':'Add'}  Product</h3>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inner}>
                    <div className={styles.fcover}>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Product Title</span>
                            <input {...register("title",{ "required": true })} type="text" className={styles.input} />
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Product DescrIption</span>
                            <input {...register("description")} type="text" className={styles.input} />
                        </label>
                    </div>
                    <div className={styles.fcover}>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Product Price</span>
                            <input {...register("price",{ "required": true })} className={styles.input} step="0.01" />
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Status</span>
                            <select className={styles.select} {...register("status",{ "required": true })}>
                                <option value={1} className={styles.option}>Enabled</option>
                                <option value={0} className={styles.option}>Disabled</option>
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
