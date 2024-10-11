import { NextApiResponse } from 'next';

export interface ApiResponse extends NextApiResponse {
  [key: string]: any;
}
