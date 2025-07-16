// pages/api/courses/index.ts

import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma' // Adjust path if not using `@` alias

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newCourse = await prisma.courses.create({
        data: req.body
      });

      res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
