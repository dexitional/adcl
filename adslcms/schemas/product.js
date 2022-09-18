export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'vat',
      title: 'Vat',
      type: 'reference',
      to: {type: 'vat'},
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'sku',
      title: 'SKU',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
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
    }
  ]
}
