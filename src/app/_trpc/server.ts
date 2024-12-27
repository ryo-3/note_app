// src/app/_trpc/server-api.ts
import { appRouter } from '@/server';
import { createTRPCContext } from '@/server/context';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { t } from '@/server/trpc';
export const serverApi = async () => {
  // 環境変数から URL を取得
  const baseUrl = process.env.BASE_URL || 'http://localhost';

  // Request オブジェクトのモックを作成
  const mockReq = new Request(baseUrl);

  // コンテキストを作成
  const ctx = await createTRPCContext({ req: mockReq } as FetchCreateContextFnOptions);

  // `t.createCallerFactory` を使用して API 呼び出し用の Caller を作成
  const createCaller = t.createCallerFactory(appRouter);

  // サーバーサイドで使用する API Caller を返す
  return createCaller(ctx);
};
