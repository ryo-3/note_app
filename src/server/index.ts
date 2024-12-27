// import { authRouter } from './router/atuh.routert';
import { notesRouter } from './router/notes.router';
import { router } from './trpc';

export const appRouter = router({
  // auth: authRouter,
  notes: notesRouter,
});

export type AppRouter = typeof appRouter;
