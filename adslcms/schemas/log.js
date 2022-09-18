export default {
  name: 'log',
  title: 'System Logs',
  type: 'document',
  fields: [
    {
      name: 'action',
      title: 'Action',
      type: 'string',
    },
    {
      name: 'meta',
      title: 'Meta',
      type: 'text',
    },
    {
      name: 'created_at',
      title: 'Created At',
      type: 'datetime',
    }
  ]
}
