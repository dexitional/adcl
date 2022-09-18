export default {
  name: 'siteid',
  title: 'Branch',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Branch Name',
      type: 'string',
    },
    {
      name: 'location',
      title: 'Branch Location',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Branch Description',
      type: 'string',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'number',
    },
    {
      name: 'slug',
      title: 'Branch Code',
      type: 'number',
    }
  ],
  
}
