export default {
  name: 'cart',
  title: 'Cart',
  type: 'document',
  fields: [
    {
      name: 'order',
      title: 'Order Reference',
      type: 'reference',
      to: {type: 'order'},
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'reference',
      to: {type: 'stock'},
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'amount',
      title: 'Amount',
      type: 'number',
    },
    {
      name: 'discount',
      title: 'Discount',
      type: 'number',
    },
    {
      name: 'tax',
      title: 'Tax',
      type: 'number',
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
    }
  ]
}
