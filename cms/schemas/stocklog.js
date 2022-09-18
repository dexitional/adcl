export default {
  name: 'stocklog',
  title: 'Stock Logs',
  type: 'document',
  fields: [
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
        type: 'user',
      }
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'reference',
      to: {
        type: 'stock',
      },
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
    },
    {
      name: 'created_at',
      title: 'Created At',
      type: 'datetime',
    }
  ]
}
