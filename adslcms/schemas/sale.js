export default {
  name: 'sale',
  title: 'Sale',
  type: 'document',
  fields: [
    {
      name: 'opened',
      title: 'Sales Opened Period',
      type: 'datetime',
    },
    {
      name: 'closed',
      title: 'Sales Closed Period',
      type: 'datetime'
    },
    {
      name: 'stock_meta',
      title: 'Stock Data Log & Count',
      type: 'text'
    },
    {
      name: 'order_meta',
      title: 'Orders Data Log Per Day',
      type: 'text'
    },
    {
      name: 'sale_date',
      title: 'Sales Date',
      type: 'date'
    },
    {
      name: 'started_by',
      title: 'Sales Started By',
      type: 'reference',
      to: {
        type:'user',
      }
    },{
      name: 'closed_by',
      title: 'Sales Closed By',
      type: 'reference',
      to: {
        type:'user',
      }
    }
  ]
}
