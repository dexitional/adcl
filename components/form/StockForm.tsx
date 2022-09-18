import axios from 'axios';
import { useRouter } from 'next/router';
import Notiflix from 'notiflix';
import React,{ useState, useEffect} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useUserStore } from '../../utils/store';

const styles = {
   wrapper : `flex flex-col space-y-10`,
   title: `text-lg text-slate-800 font-medium tracking-wider`,
   label: `flex-1 flex flex-col space-y-2`,
   labeltitle: `text-[0.8rem] font-medium text-slate-800`,
   input: `px-3 py-2 border rounded drop-shadow-sm outline-none text-slate-500 placeholder-slate-500`,
   select: `px-3 py-2 border bg-none rounded drop-shadow-sm outline-none text-slate-500 placeholder-slate-500`,
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
    product: string,
    branch: string,
    quantity:number,
    status:number,
    price:number
};

export default function StockForm({ setPage,page,setId,id }: any) {
  const { helper, eid } = useUserStore((state) => state );
  const fetchHelpers = useUserStore((state) => state.fetchHelpers);
  const { register, handleSubmit,getValues,setValue, formState: { errors } } = useForm<Inputs>();
  const router = useRouter()

  const loadRecord = async () => {
    const res = await axios.get('/api/stocks/'+id);
    if(res.data.success){
        const dt = res.data.data[0]
        setValue('product', dt.product._ref);
        setValue('branch',dt.siteid._ref);
        setValue('quantity', dt.quantity);
        setValue('status', dt.status);
        setValue('price', dt.price);
       
    } 
  }
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let res;
    if(id){
        res = await axios.put('/api/stocks/'+id, data);
    }else{
        res = await axios.post('/api/stocks', data);
    }
    if(res.data.success){
        Notiflix.Notify.success('SAVED SUCCESSFULLY!');
        useUserStore.setState({ eid: null })
        setId(null)
        setPage('list')
        //router.push("")
    } 
  }
  const cancelForm = (e: any) => {
      e.preventDefault()
      useUserStore.setState({ eid: null })
      setId(id)
      setPage('list')
  }

  useEffect(() => {
    fetchHelpers();
    id && loadRecord()
  },[])

  return (
    <div className={styles.wrapper}>
        <div>
            <h3 className={styles.title}>{page == 'edit' ? 'Edit':'Add'} Stock</h3>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inner}>
                    <div className={styles.fcover}>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Product</span>
                            <select className={styles.select} {...register("product",{ "required": true })}>
                                <option className={styles.option} disabled selected>-- CHOOSE --</option>
                              { helper?.products?.map((row:any,i:React.Key) => (
                                 <option key={i} value={row._id} className={styles.option}>{row.title}</option>
                              ))}
                            </select>
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Branch</span>
                            <select className={styles.select} {...register("branch",{ "required": true })}>
                                 <option className={styles.option} disabled selected>-- CHOOSE --</option>
                              { helper?.branches?.map((row:any,i:React.Key) => (
                                 <option key={i} value={row._id} className={styles.option}>{row.title.toUpperCase()}</option>
                              ))}
                            </select>
                        </label>
                    </div>
                    <div className={styles.fcover}>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Stock Quantity</span>
                            <input className={styles.input} {...register("quantity",{ "required": true })} type="number" min={0} />
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Stock Status</span>
                            <select className={styles.select} {...register("status",{ "required": true })}>
                               <option value={0} className={styles.option}>DISABLED</option>
                               <option value={1} className={styles.option}>ENABLED</option>
                            </select>
                        </label>
                    </div>
                    <div className={styles.fcover}>
                        <label className={styles.label}>
                            <span className={styles.labeltitle}>Product Price</span>
                            <input className={styles.input} {...register("price",{ "required": true })} type="number" step="0.01" min={0} />
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
