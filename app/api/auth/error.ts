// pages/api/auth/error.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle the API request
  // For example, you could return an error message
  res.status(500).json({ error: 'Internal Server Error' });
}
