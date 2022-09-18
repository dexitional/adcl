export default {
  name: 'stock',
  title: 'Stock',
  type: 'document',
  fields: [
    
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: {type: 'product'},
    },
    {
      name: 'quantity',
      title: 'Stock Quantity',
      type: 'number',
      default: 0
    },
    {
      name: 'status',
      title: 'Status',
      type: 'number',
      default: 1,
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
