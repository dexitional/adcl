export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User ID',
      type: 'reference',
      to: {
        type:'user',
      }
    },
    {
      name: 'oid',
      title: 'Order Number',
      type: 'string'
    },
    {
      name: 'amount',
      title: 'Order Amount',
      type: 'number'
    },
    {
      name: 'discount',
      title: 'Order Discount',
      type: 'number'
    },
    {
      name: 'tax',
      title: 'Order tax',
      type: 'number'
    },
    {
      name: 'refname',
      title: 'Reference Name',
      type: 'string'
    },
    {
      name: 'refphone',
      title: 'Reference Contact',
      type: 'string'
    },
    {
      name: 'ordertype',
      title: 'Order Type',
      type: 'string',
    },
    {
      name: 'approval',
      title: 'Approval Status',
      type: 'number',
    },
    {
      name: 'completed',
      title: 'Complete Status',
      type: 'number',
    },
    {
      name: 'created_at',
      title: 'Created At',
      type: 'date',
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
