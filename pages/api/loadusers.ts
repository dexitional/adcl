// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { loadUsers } from '../../utils/apiServer'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const rs = await loadUsers()
  res.status(200).json({ name: 'John Doe' })
}
