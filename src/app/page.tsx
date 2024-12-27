import Note from '../components/common/note';
import SideBar from '../components/common/side-bar';
export default async function Home() {
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
