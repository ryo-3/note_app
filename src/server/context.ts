// server/router/context.ts
import * as trpc from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'; // Import

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    req: opts.req,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createTRPCContext>;
