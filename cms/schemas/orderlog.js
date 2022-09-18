export default {
  name: 'orderlog',
  title: 'Order Log',
  type: 'document',
  fields: [
    {
      name: 'oid',
      title: 'Order Number',
      type: 'string',
    },
    {
      name: 'order',
      title: 'Order ID',
      type: 'string',
    },
    {
      name: 'action',
      title: 'Action',
      type: 'string',
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: {
        type:'user',
      }
    },
    {
      name: 'amount',
      title: 'Amount',
      type: 'number',
    },{
      name: 'meta',
      title: 'Meta',
      type: 'text',
    },
    {
      name: 'created_at',
      title: 'Created At',
      type: 'datetime',
    },
    {
      name: 'siteid',
      title: 'Branch ID',
      type: 'reference',
      to: {
        type:'siteid',
      }
    }
    
  ]
}
