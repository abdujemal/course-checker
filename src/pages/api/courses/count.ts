// src/pages/api/courses/count.ts

import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma' // or relative path like ../../lib/prisma if no alias

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const count = await prisma.courses.count()
    return res.status(200).json({ count })
  } catch (error: any) {
    console.error('Error counting courses:', error)
    return res.status(500).json({ error: 'Failed to count courses' })
  }
}
