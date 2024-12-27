'use server';

import Note from './components/common/note';
import SideBar from './components/common/side-bar';
import { serverApi } from './_trpc/server';
export default async function Home() {
  const api = await serverApi();
  const notes = await api.notes.getAllNotes();
  console.log(notes);

  // if (typeof window === 'undefined') {
  //   console.log('ああああああああ'); // サーバー側でのみ表示
  // }

  return (
    <div className="flex">
      <div className="border-r-2 min-h-screen border-black">
        <SideBar />
      </div>
      <div className="px-10 pt-5 pb-20 w-full">
        <Note />
      </div>
    </div>
  );
}
