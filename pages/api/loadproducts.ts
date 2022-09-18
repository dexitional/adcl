// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { loadProducts } from '../../utils/apiServer'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const rs = await loadProducts()
  res.status(200).json({ name: 'John Doe' })
}
