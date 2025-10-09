import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import app from "../src/server/main.js";

// Wrap Express app with serverless-http for Vercel
const handler = serverless(app);

export default async (req: VercelRequest, res: VercelResponse) => {
  return handler(req as any, res as any);
};