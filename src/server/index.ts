import { notesRouter } from './router/notes.router';
import { router } from './trpc'; // `router` にはすでに `Context` 型が適用されている

export const appRouter = router({
  notes: notesRouter,
});

export type AppRouter = typeof appRouter;
