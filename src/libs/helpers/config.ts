import { QueryClient } from '@tanstack/react-query';
import Axios from 'axios';

export const abortRequestController = new AbortController();

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASEURL + '/api/v1',
  withCredentials: true,
  signal: abortRequestController.signal,
});

