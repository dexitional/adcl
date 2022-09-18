import type { NextPage } from 'next'
import POSCart from '../components/POSCart'
import POSHeld from '../components/POSHeld'
import POSLayout from '../components/POSLayout'
import POSProduct from '../components/POSProduct'
import SearchBox from '../components/SearchBox'
import { FaShoppingCart } from 'react-icons/fa'
import { client } from '../sanity';
import { useUserStore } from '../utils/store'
import { useEffect,useState } from 'react'
import { useRouter } from 'next/router'
import Receipt from '../components/Receipt'
import moment from 'moment'
import axios from 'axios'
import Notiflix from 'notiflix'
import Logo from '../public/loader.gif'

const POS: NextPage = ({ stocks }: any) => {
  const { siteid,cart:cts,held:hds,user } = useUserStore(state => state)
  const router = useRouter()
  const [ held,setHeld ] = useState<any>([]);
  const [ cart,setCart ] = useState<any>([]);
  const [ oid,setOid ] = useState<string>(moment().format('YYMMDDHHmmss'));
  const [ odate,setOdate ] = useState<string>(moment().format('LL'));
  const [ title,setTitle ] = useState<string>('');
  const [ tag,setTag ] = useState<string>('');
  const [ keyword, setKeyword ] = useState('');
  const [ activity, setActivity ] = useState({ submitted: false, creditted: false, invoiced: false, held: false })

  const onChange = (e:any) => {
    e.preventDefault();
    setKeyword(e.target.value)
    router.push(`?siteid=${siteid}&search=${encodeURIComponent(keyword)}`)
  }

  const onSubmit = () => {
    router.push(`?siteid=${siteid}&search=${encodeURIComponent(keyword)}`)
  }

  const submit = async () => {
    if(activity.submitted ) return false;
    setTitle('RECEIPT')
    setActivity({...activity, submitted: true })
    const dataToServer = {
      user: user._id,
      branch: siteid,
      ordertype:'normal',
      approval:1,
      completed:1,
      amount: cart.reduce((sum: number,cur:any) => sum+(parseFloat(cur.price) * parseInt(cur.quantity)), 0),
      tag:tag,
      cart: cart
    }
    try{
      if(cart.length <= 0) throw new Error('NO PRODUCTS IN CART!')
      const ok = window.confirm(`Process Cash Order ?`)
      if(ok){
        const result = await axios.post('/api/orders', dataToServer)
        if(result.data.success){
          Notiflix.Notify.success('ORDER SAVED!');
          const { oid:orderNo,created_at } = result.data.data;
          setOid(orderNo)
          setOdate(moment(created_at).format('LL'))
          //router.reload()
          setKeyword('')
          setTimeout(() => {
            window.print()
            setTitle('')
            setOid('')
            setTag('')
            setCart([])
          },3000)
        }else{
          Notiflix.Notify.failure('ORDER FAILED!');
        }
      }
    } catch (e: any){
      Notiflix.Notify.failure(e.message.toUpperCase());
    }
    setActivity({...activity, submitted: false })
  }

  const invoice = () => {
    if(activity.invoiced ) return false;
    const ok = window.confirm("Generate Invoice ?")
    if(ok){
      if(cart.length <= 0){
        Notiflix.Notify.failure('NO PRODUCT IN CART!');
        return false;
      }
      setActivity({...activity, invoiced: true })
      setTitle('INVOICE')
      setOid('')
      window.print()
      setTimeout(()=> {
        Notiflix.Notify.info('INVOICE GENERATED!');
        setActivity({...activity, invoiced: false })
      },500)
    }
  }
  const credit = async () => {
    setTitle('RECEIPT')
    const dataToServer = {
      user: user._id,
      branch: siteid,
      ordertype:'credit',
      approval:0,
      completed:1,
      amount: cart.reduce((sum: number,cur:any) => sum+(parseFloat(cur.price) * parseInt(cur.quantity)), 0),
      tag:tag,
      cart: cart
    }
    try{
      const result = await axios.post('/api/orders', dataToServer)
      if(result.data.success){
        const { oid:orderNo } = result.data.data;
        setOid(orderNo)
        Notiflix.Notify.success('ORDER SAVED!');
        window.print();
        setTimeout(()=>{
          setTitle('')
          setOid('')
          setTag('')
          setCart([])
        },2000)
      }else{
        Notiflix.Notify.failure('ORDER FAILED!');
      }
    } catch (e){
      Notiflix.Notify.failure('ORDER FAILED!');
    }
  }
  const hold = () => {
    if(cart?.length > 0){
      setHeld([{ tag, title:moment().format('LLL'), cart }, ...held ])
      setCart([])
    } else{
      Notiflix.Notify.failure('NO PRODUCT IN CART!');
    }
  }
  const reset = () => {
    setCart([]);
    setOid('');
  }
  const addToCart = (id:string,title:string,price:number,quantity:number) => {
    const row = cart.find((r:any) => r.id === id)
    //if(!row) setCart([{ id,title,price,quantity:1 }, ...cart ])
    if(!row) setCart([...cart,{ id,title,price,quantity:1 } ])
  }
  const deleteFromCart = (id:string) => {
    const new_cart = cart.filter((r:any) => r.id !== id)
    setCart([...new_cart ])
  }
  const deleteFromHeld = (id:string) => {
    const new_held = held.filter((r:any,i:React.Key) => i !== id)
    setHeld([...new_held ])
  }
  const resumeFromHeld = (id:string) => {
    const rec = held.find((r:any,i:React.Key) => i === id)
    const nrec = held.filter((r:any,i:React.Key) => i !== id)
    if(rec){
      setTag(rec.tag)
      setCart([...rec.cart ])
      setHeld(nrec);  
    }
  }
  const updateCartItem = (id:string,qty:number) => {
    const new_cart = cart.map((r:any) => {
      if(r.id === id) return {...r, quantity: qty };
      return r;
    })
    setCart([...new_cart ])
  }
  const openStore = async () => {
    const dataToServer = { action:'opensale', sale_date:moment().format("YYYY-MM-DD"), opened:moment().format("HH:mm:ss"), user:user._id }
    try{
      const result = await axios.post('/api/orders', dataToServer)
      //const result = { data: { success: true }}
      if(result.data.success){
        Notiflix.Notify.info('SHOP OPENED');
        useUserStore(state => state.fetchHelpers)
      }else{
        Notiflix.Notify.failure('SHOP STILL CLOSED!');
      }
    } catch (e){
      Notiflix.Notify.failure('SHOP STILL CLOSED!');
    }
  }
  
  useEffect(() => {
    //siteid && router.push('?siteid='+siteid)
  },[siteid])

  useEffect(() => {
    useUserStore.setState({ cart })
  },[cart])

  useEffect(() => {
    useUserStore.setState({ held })
  },[held])

  useEffect(() => {
      hds && setHeld([ ...hds ])
      cts && setCart([ ...cts ])
      //alert(JSON.stringify(stocks))
  },[])

  useEffect(() => {
      onSubmit()
  },[keyword])

  return (
     <>
     <POSLayout openStore={openStore}>
        {/* Product */}
        <div className="w-full grid md:grid-cols-3 gap-6">
            <div className="flex flex-col">
                <h3 className="flex justify-between mx-3 py-1 px-5 bg-slate-50 border border-slate-100 rounded-full indent-2 text-xs text-slate-600 font-semibold tracking-widest">
                  <span>PRODUCTS</span>
                  { stocks.length > 0 && <span className="py-0 px-0.5 rounded-full bg-gray-500 text-[0.9em] text-white text-center flex items-center justify-center">{stocks.length}</span>}
                </h3>
                <SearchBox onChange={onChange} onSubmit={onSubmit} value={keyword} />
                <div className="mx-4 rounded-md border">
                  <POSProduct stocks={stocks} addToCart={addToCart} cart={cart} />
                </div>
            </div>
            {/* Cart Box */}
            <div className="">
              <h3 className="mx-3 py-1 px-5 bg-slate-50 rounded-full text-xs text-slate-600 font-semibold tracking-widest">CART</h3>
              <div className="mx-4 my-4 flex flex-col border">
                <div className="p-2 px-3 border-b border-slate-400 bg-slate-50">
                    <h4 className="my-2 pb-2 flex space-x-3 items-center  justify-between border-b text-xs text-slate-600 font-semibold tracking-widest">
                      <FaShoppingCart className="w-4 h-4" />
                      <span className="hidden">ORDER NO: {oid} {siteid}</span>
                      <div className="flex-1 border rounded-full overflow-hidden">
                         <input type="text" onChange={(e) => setTag(e.target.value)} placeholder={`Enter a tag for Order or Customer ...`} className="py-1.5 px-4 w-full outline-none" />
                      </div>
                    </h4>
                    <div className="my-3 flex flex-wrap gap-1 justify-between items-center">
                         { ! activity.submitted && <button onClick={submit} className="text-xs p-2 py-1 font-semibold text-gray-600 border border-slate-400 bg-green-200 rounded-md">
                            <span>Submit</span></button>
                         }
                         { activity.submitted &&<button onClick={submit} className="text-xs p-2 py-1 font-semibold text-gray-600 border border-slate-400 bg-green-200 rounded-md">
                           <span className="flex space-x-1"><img src={Logo.src} className="w-4 h-4" /><span>Processing</span></span>
                          </button>
                         }

                        <button onClick={credit} className="hidden text-xs p-2 py-1 font-semibold text-gray-600 border border-slate-400 bg-red-200 rounded-md">Credit</button>
                        <button onClick={hold} className="text-xs p-2 py-1 font-semibold text-gray-600 border border-slate-400 bg-yellow-200 rounded-md">
                           { ! activity.held ? 
                              <span>Hold</span>
                            : <span className="flex space-x-1"><img src={Logo.src} className="w-4 h-4" /><span>Processing</span></span>
                          }
                        </button>
                        <button onClick={invoice} className="text-xs p-2 py-1 font-semibold text-gray-600 border border-slate-400 bg-slate-200 rounded-md">
                        { ! activity.invoiced ? 
                              <span>Invoice</span>
                            : <span className="flex space-x-1"><img src={Logo.src} className="w-4 h-4" /><span>Processing</span></span>
                          }
                        </button>
                        <button onClick={reset} className="text-xs p-2 py-1 font-semibold text-gray-600 border border-slate-400 bg-red-300 rounded-md">Reset</button>
                    </div>
                </div>
                <div className="bg-scroll">
                   <POSCart cart={cart} deleteFromCart={deleteFromCart} updateCartItem={updateCartItem} />
                </div>
                <div className="p-3 px-6 flex items-center border-t border-slate-400 bg-slate-50">
                  <div className="flex-1 flex justify-between">
                    <h4 className="text-sm font-bold text-slate-600">TOTAL</h4>
                    <h4 className="text-sm font-bold text-slate-600">GHC {cart.reduce((sum: number,cur:any) => sum+(parseFloat(cur.price) * parseInt(cur.quantity)), 0)}</h4>
                  </div>
                </div>
              </div>
            </div>
            {/* Order Sheet */}
            <div>
               <h3 className="mx-3 py-1 px-5 bg-slate-50 rounded-full text-xs text-slate-600 font-semibold tracking-widest">SAVED ORDER SESSIONS</h3>
               <div className="mx-4 my-4 flex flex-col border">
                 <POSHeld held={held} deleteFromHeld={deleteFromHeld} resumeFromHeld={resumeFromHeld} />
               </div>
            </div>
        </div>
        
     </POSLayout>
     {/* Printout */}
     <div className="hidden print:flex print:p-0 print:m-0 print:bg-white print:drop-shadow-none print:space-x-0 print:border-0 relative items-center justify-center px-10 py-4 space-x-6 rounded border w-full max-w-xl my-10 mx-auto bg-slate-100/20 drop-shadow-sm">
       <Receipt title={title} cart={cart} oid={oid} date={odate} className=""/>
     </div>
     </>
  )
}

export default POS



export async function getServerSideProps(context:any){
  //const { siteid } = useUserStore(state => state)
  let { search,siteid } = context.query;
  //let siteid = null
  let query = ``
  var results;

  if (search && search !== ''){ 
     query = `*[_type == "stock" && product->title match $search && siteid._ref == $siteid]{_id,"product":product->title,"price":product->price,quantity,"branch":siteid->title,_createdAt } | order(product->_id)`
     results = await client.fetch(query,{ search:`${search}*`,siteid });
  } else{
     //query = `*[_type == "stock" && _id > $lastId]{_id,product->{title} as product,product->{price} as price,quantity,_createdAt } | order(_id) [0...100]`
     
     //query = `*[_type == "stock"]{_id,"product":product->title,"price":product->price,quantity,"branch":siteid->title,_createdAt } | order(product->_id) [0...10]`
     //results = await client.fetch(query);
     results = null;
  }
  
  console.log(results,search,siteid)
  
  if(!results) return { props: { stocks: []}}
  return {
     props: {
        stocks: results
     }
  }

  


}
