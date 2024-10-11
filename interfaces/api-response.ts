import { NextApiRequest } from 'next';

export interface ApiRequest extends NextApiRequest {
  [key: string]: any;
}
