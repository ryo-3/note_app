// src/app/_trpc/client.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server';

export const clientApi = createTRPCReact<AppRouter>();
