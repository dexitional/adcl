import axios from "axios";
import { server } from '../sanity'
import { groq } from "next-sanity";
import moment from "moment";
var bcrypt = require('bcrypt');

export const verifyUser = async ({ username }) => {
  const query = groq`*[_type == "user" && username == $username]{_id,username,password,name,phone,location,address,email,role,"siteid":siteid->_id } [0]`
  const results = await server.fetch(query,{ username });
  if(results){
    return results
  }
  return null;
};

export const loadUsers = async () => {
  const users = require('../public/user.json')
  users?.length > 0 && users?.forEach((user) => {
    console.log(user)
    server.create({
       _id: user['$oid'],
       _type: 'user',
       name: user.name,
       username: user.username,
       password: user.password,
       created_at: user['$date'],
       email: user.email,
       phone: user.phone,
       address: user.address,
       location: user.location,
       allow_access: user.allow_access,
       role: user.role
    })
  })
  return null;
};


export const loadProducts = async () => {
  const products = require('../public/product.json')
  let transaction = server.transaction()
    /*
    documents.forEach(document => {
      transaction.createOrReplace(document)
    })
    */
    
  products?.length > 0 && products?.forEach((product) => {
    console.log(product)
    /*
    transaction.create({
       _id: product['$oid'],
       _type: 'product',
       title: product.title,
       price: product.price,
       quantity: parseInt(product.quantity),
       created_at: product['$date'],
    })
    */
  })
  return transaction.commit()
};

export const loadStocks = async () => {
  //const products = require('../public/product.json')
  const query = `*[_type == "product"]`
  const stocks = await server.fetch(query);
  
  let transaction = server.transaction()
  stocks?.length > 0 && stocks?.forEach((stock) => {
    transaction.create({
       product: { _ref : stock._id },
       _type: 'stock',
       quantity: parseInt(stock.quantity),
       status: 1,
       created_at: new Date(),
       siteid : { _ref : "95ffe959-8380-48de-8928-923643aff15c" },
    })
  })
  return transaction.commit()
};

export const fixStockQty = async () => {
  const query = `*[_type == "stock"]`
  const stocks = await server.fetch(query);
  let transaction = server.transaction()
  stocks?.length > 0 && stocks?.forEach((stock) => {
    transaction.patch(stock._id,
    {
      set:{ quantity: parseInt(stock.quantity) }
    })
  })
  return transaction.commit()
};

export const fixOrderDate = async () => {
  //const products = require('../public/product.json')
  const query = `*[_type == "order"]`
  const orders = await server.fetch(query);
  let transaction = server.transaction()
  orders?.length > 0 && orders?.forEach((order) => {
    transaction.patch(order._id,
    {
      set:{ created_at: moment(order.created_at).format("YYYY-MM-DD") }
    })
  })
  return transaction.commit()
};


export const resetShops = async () => {
  // const products = require('../public/product.json')
  const query = `*[_type == "product"]`
  const products = await server.fetch(query);
  const query2 = `*[_type == "stock"]`
  const stocks = await server.fetch(query2);
  let transaction = server.transaction()
  products?.length > 0 && products?.forEach((product) => {
    transaction.patch(product._id,{ set: { price: 0, quantity: 0 } })
  })
  stocks?.length > 0 && stocks?.forEach((stock) => {
    transaction.patch(stock._id,{ set: { quantity: 0 } })
  })
  return transaction.commit()
};

// HELPERS 

export const fetchHelpers = async () => {
  const query = 
  groq`{
        "products": *[_type == "product"] | order(title),
        "branches": *[_type == "siteid"],
        "sale": *[_type == "sale" && sale_date == $curdate]  
      }`
  const results = await server.fetch(query,{ curdate: moment().format('YYYY-MM-DD') });
  if(results){
    return results
  }
  return null;
};

// PRODUCTS ENDPOINTS

export const fetchProducts = async () => {
  const query = groq`*[_type == "product"]`
  const results = await server.fetch(query);
  if(results){
    return results
  }
  return null;
};

export const fetchProduct = async (id) => {
  const query = groq`*[_type == "product" && _id == $id ]`
  const results = await server.fetch(query,{ id });
  if(results){
    return results
  }
  return null;
};

export const createProduct = async (doc) => {
  const result = server.create({
    _type: 'product',
    title: doc.title,
    price: parseFloat(doc.price),
    quantity: parseFloat(doc.quantity),
    status: 1,
    created_at: new Date(),
  })
  return result
};

export const updateProduct = async (id,doc) => {
  const result = server
    .patch(id)
    .set({
      title: doc.title,
      price: parseFloat(doc.price),
      quantity: parseFloat(doc.quantity),
      status: doc.status,
    })
    .commit()
  return result; 
};

export const deleteProduct = async (id) => {
  const result = server
    .delete(id)
  return result; 
};



// STOCKS ENDPOINTS

export const fetchStocks = async () => {
  const query = groq`*[_type == "stock"]`
  const results = await server.fetch(query);
  if(results){
    return results
  }
  return null;
};

export const fetchStock = async (id) => {
  const query = groq`*[_type == "stock" && _id == $id]{_id,product,quantity,status,siteid,created_at,"price":product->price }`
  const results = await server.fetch(query,{ id });
  if(results){
    return results
  }
  return null;
};

export const createStock = async (doc) => {
  let transaction = server.transaction()
  transaction.create({
    _type: 'stock',
    product: { _ref : doc.product },
    quantity: parseFloat(doc.quantity),
    status: 1,
    created_at: new Date(),
    siteid : { _ref : doc.branch },
  })
  transaction.patch(doc.product,{ set: { price: parseFloat(doc.price) } })
  return transaction.commit()
};

export const updateStock = async (id,doc) => {
  let transaction = server.transaction()
  transaction.patch(id,{ set: {
    product: { _ref : doc.product },
    quantity: parseFloat(doc.quantity),
    status: doc.status,
    siteid : { _ref : doc.branch },
  } })
  transaction.patch(doc.product,{ set: { price: parseFloat(doc.price) } })
  return transaction.commit()
};

export const deleteStock = async (id) => {
  const result = server
    .delete(id)
  return result; 
};

export const upgradeStock = async (data) => {
  const { action, product, quantity } = data 
  let result;
  if(action == 'inc'){
     result = server
     .patch(product) // Document ID to patch
     .inc({quantity:parseInt(quantity)}) // Increment field by count
     .commit()
  }
  if(action == 'dec'){
    result = server
    .patch(product) // Document ID to patch
    .dec({ quantity : parseInt(quantity) }) // Decrease field by count
    .commit()
  }
  return result; 

  /*
    server
     .patch(product) // Document ID to patch
     .set({inStock: false}) // Shallow merge
     .inc({numSold: 1}) // Increment field by count
     .commit()
  
  */

};



// USERS ENDPOINTS

export const fetchUsers = async () => {
  const query = groq`*[_type == "user"]`
  const results = await server.fetch(query);
  if(results){
    return results
  }
  return null;
};

export const fetchUser = async (id) => {
  const query = groq`*[_type == "user" && _id == $id]`
  const results = await server.fetch(query,{ id });
  if(results){
    return results
  }
  return null;
};

export const createUser = async (doc) => {
  const password = bcrypt.hashSync(`kuukuapos${new Date().getFullYear()}`,10);
  const result = server.create({
    _type: 'user',
    name: doc.name,
    username: doc.username,
    password,
    phone: doc.phone,
    email: doc.email,
    location: doc.location,
    address: doc.address,
    role: doc.role,
    allow_access: doc.allow_access,
    status: 1,
    created_at: new Date(),
    siteid : { _ref : doc.branch },
  })
  return result
};

export const updateUser = async (id,doc) => {
  const result = server
    .patch(id)
    .set({
      name: doc.name,
      username: doc.username,
      phone: doc.phone,
      email: doc.email,
      location: doc.location,
      address: doc.address,
      role: doc.role,
      siteid : { _ref : doc.branch },
    })
    .commit()
  return result; 
};

export const deleteUser = async (id) => {
  const result = server
    .delete(id)
  return result; 
};

export const resetUserPass = async (id) => {
  const pwd = `kuukuapos${new Date().getFullYear()}`
  const password = bcrypt.hashSync(pwd,10);
  const result = server
    .patch(id)
    .set({
      password,
    })
    .commit()
  return { data:result, password:pwd }
};

export const changeUserPass = async (id,password) => {
  password = bcrypt.hashSync(password,10);
  const result = server
    .patch(id)
    .set({
      password,
    })
    .commit()
  return result; 
};




// BRANCH ENDPOINTS

export const fetchBranches = async () => {
  const query = groq`*[_type == "siteid"]`
  const results = await server.fetch(query);
  if(results){
    return results
  }
  return null;
};

export const fetchBranch = async (id) => {
  const query = groq`*[_type == "siteid" && _id == $id]`
  const results = await server.fetch(query,{ id });
  if(results){
    return results
  }
  return null;
};

export const createBranch = async (doc) => {
  const result = server.create({
    _type: 'siteid',
    title: doc.title,
    location: doc.location,
    description: doc.description,
    status: 1,
    created_at: new Date(),
  })
  return result
};

export const updateBranch = async (id,doc) => {
  const result = server
    .patch(id)
    .set({
      title: doc.title,
      location: doc.location,
      description: doc.description,
    })
    .commit()
  return result; 
};

export const deleteBranch = async (id) => {
  const result = server
    .delete(id)
  return result; 
};




// ORDERS ENDPOINTS

export const fetchOrders = async () => {
  const query = groq`*[_type == "order"]`
  const results = await server.fetch(query);
  if(results){
    return results
  }
  return null;
};

export const fetchOrder = async (id) => {
  const query = groq`*[_type == "order" && _id == $id][0]`
  const order = await server.fetch(query,{ id });
  const query2 = groq`*[_type == "cart" && order._ref == $id]{ _id, price, quantity, amount, "title": stock->product->title }`
  const cart = await server.fetch(query2,{ id });
  if(order && cart){
    return { ...order,cart }
  } return null;
};


export const createOrder = async (doc) => {
  const oid = moment().format('YYMMDDHHmmss')
  const created_at = moment().format("YYYY-MM-DD")
  let transaction = server.transaction()
  
  const order = transaction.create({
    _id: oid,
    _type: 'order',
    user: { _ref : doc.user },
    siteid: { _ref : doc.branch },
    oid,
    amount: doc.amount,
    tax: 0,
    discount: 0,
    refname: doc.tag,
    ordertype: doc.ordertype,
    completed: doc.completed,
    approval: doc.approval,
    created_at
  })
  //const order_ins = await order;
  doc.cart.length > 0 && doc.cart.map((ct) => {
    // Create Order
    transaction.create({
       order: { _ref : oid },
       stock: { _ref : ct.id },
       _type: 'cart',
       quantity: parseFloat(ct.quantity),
       price: parseFloat(ct.price),
       discount: 0,
       tax: 0,
       amount: parseFloat(ct.price) * parseFloat(ct.quantity),
    })
    // Reduce Stock Quantity
    transaction.patch(ct.id,{ dec: { quantity: parseFloat(ct.quantity) } })
    // Create StockLog
    transaction.create({ _type:'stocklog', action: `Reduced stock [ ${ct.title} ] by [ ${ct.quantity} ]`, stock: { _ref: ct.id}, user: { _ref: doc.user}, quantity: parseFloat(ct.quantity), created_at: moment().format("YYYY-MM-DD HH:mm:ss") })
  })
  // Log Order For Future Debugging
  transaction.create({
    order: oid,
    siteid: { _ref : doc.branch },
    _type: 'orderlog',
    oid,
    action: "create",
    user: { _ref : doc.user } ,
    amount: parseFloat(doc.amount),
    meta: JSON.stringify(doc),
    created_at
  })
  // Log Request
  server.create({
    _type: 'log',
    action: "create cash order",
    meta: JSON.stringify(doc),
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  })
  // Commit Transactions
  return transaction.commit()
  //return { ...order_ins }
};


/*
export const createOrder = async (doc) => {
  const oid = moment().format('YYMMDDHHmmss')
  const order = server.create({
    _type: 'order',
    user: { _ref : doc.user },
    siteid: { _ref : doc.branch },
    oid,
    amount: doc.amount,
    tax: 0,
    discount: 0,
    refname: doc.tag,
    ordertype: doc.ordertype,
    completed: doc.completed,
    approval: doc.approval,
    created_at: moment().format("YYYY-MM-DD"),
  })
  const order_ins = await order;
  if(order_ins) return { ...order_ins }
  return null
};
*/

export const createCart = async (order,cart) => {
 if(order){
    let transaction = server.transaction()
    cart.map((ct) => {
      // Create Cart
      transaction.create({
        order: { _ref : order._id },
        stock: { _ref : ct.id },
        _type: 'cart',
        quantity: parseFloat(ct.quantity),
        price: parseFloat(ct.price),
        discount: 0,
        tax: 0, 
        amount: parseFloat(ct.price) * parseFloat(ct.quantity),
      })
      // Reduce Stock Quantity
      transaction.patch(ct.id,{ dec: { quantity: parseFloat(ct.quantity) } }).commit()
      // Create StockLog
      transaction.create({ _type:'stocklog', action: `Reduced stock [ ${ct.title} ] by [ ${ct.quantity} ]`, stock: { _ref: ct.id}, user: { _ref: order.user._ref}, quantity: parseFloat(ct.quantity), created_at: moment().format("YYYY-MM-DD HH:mm:ss") })
    })
    return transaction.commit()
  } return null;
};

export const createOrderLog = async (order,doc) => {
   // Order Log For Future Debugging
   server.create({
    order: order._id,
    siteid: { _ref : doc.branch },
    _type: 'orderlog',
    oid: order.oid,
    action: "create",
    user: { _ref : doc.user } ,
    amount: doc.amount,
    meta: JSON.stringify(doc),
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  })
  return null
};

export const createLog = async (doc,action) => {
  // System Log For Future Debugging
  server.create({
    _type: 'log',
    action: action,
    meta: JSON.stringify(doc),
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  })
  return null
};

export const createStockLog = async (doc,action) => {
  // System Log For Future Debugging
  server.create({
    _type: 'stocklog',
    action: action,
    stock: { _ref : doc.stock},
    quantity: doc.quantity,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  })
  return null
};

export const updateOrder = async (id,doc) => {
  const result = server
    .patch(id)
    .set({
      title: doc.title,
      location: doc.location,
      description: doc.description,
    })
    .commit()
  return result; 
};

export const deleteOrder = async (id) => {
  let transaction = server.transaction()
  const query = `*[_type == "cart" && order._ref == $id]`
  const carts = await server.fetch(query,{ id });
  if(carts && carts.length > 0){
    carts.forEach((cart) => {
      transaction.delete(cart._id)
      transaction.patch(cart.stock._ref,{ inc: { quantity: parseInt(cart.quantity) } })
    })
  }
  transaction.delete(id)
  return transaction.commit()
};

export const approveOrder = async (doc) => {
  const result = server
    .patch(order)
    .set({
      approval: 1,
      completed: 1,
    })
    .commit()
  return result; 
};

export const returnOrder = async (doc) => {
  const { order } = doc;
  const query = `*[_type == "cart" && order._ref == $order]`
  let transaction = server.transaction()
  const carts = await server.fetch(query,{ order });
  if(carts && carts.length > 0){
    carts.forEach((cart) => {
      transaction.patch(cart.stock._ref,{ inc: { quantity: parseInt(cart.quantity) } })
    })
  }
  transaction.patch(order,{
    set:{ approval: 2 }
  })
  return transaction.commit()
};

export const openStore = async (doc) => {
  const result = server.create({
    _type: 'sale',
    opened: doc.opened,
    opened_by: doc.user,
    sale_date: doc.sale_date,
  })
  return result
};


export const closeStore = async (doc) => {
  const stocks = server.fetch(groq`*[_type == "stock"]{ _id,"product":product->title,"price":product->price,quantity,"branch":siteid->title,_createdAt }`,{ curdate: moment().format("YYYY-MM-DD") })
  const orders = server.fetch(groq`*[_type == "order" && created_at == $curdate]{ _id,amount,oid,ordertype,"branch":siteid->title,"user":user->name,created_at }`,{ curdate: moment().format("YYYY-MM-DD") })
  const result = server
  .patch(doc.id)
  .set({
    closed: moment().format("YYYY-MM-DD HH:mm:ss"),
    closed_by: doc.user,
    stock_meta: stocks,
    order_meta: orders,
  })
  return result
};
