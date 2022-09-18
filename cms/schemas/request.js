export default {
  name: 'request',
  title: 'Request',
  type: 'document',
  fields: [
    
    {
      name: 'from_stock',
      title: 'Stock to Reduce',
      type: 'reference',
      to: {type: 'stock'},
    },
    {
      name: 'to_stock',
      title: 'Stock to Increase',
      type: 'reference',
      to: {type: 'stock'},
    },
    {
      name: 'requested_by',
      title: 'Requested By',
      type: 'reference',
      to: {type: 'user'},
    },
    {
      name: 'approved_by',
      title: 'Approved By',
      type: 'reference',
      to: {type: 'user'},
    },
    {
      name: 'quantity',
      title: 'Quantity to Transfer',
      type: 'number',
      default: 1,
    },
    {
      name: 'requested_at',
      title: 'Requested At',
      type: 'datetime',
    },
    {
      name: 'approved_at',
      title: 'Approved At',
      type: 'datetime',
    }  
    
  ]
}
