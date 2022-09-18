export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'username',
      title: 'Username',
      type: 'string',
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
    },
    {
      name: 'role',
      title: 'Role Access',
      type: 'string',
      default: 'admin'
    },
    {
      name: 'allow_access',
      title: 'Allow Access',
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
    
  ],
  
}
