import { DocScreen, Lists, Docs } from "../components";
import useProfileStore from "@/store/profileStore";

function App() {
  const { profile } = useProfileStore();
  const { theme } = profile.profile;
  const checkThemeStatus = theme == "black" ? "!bg-black !text-while" : "";

  return (
    <>
      <div
        className={`grid xl:grid-cols-7 lg:grid-cols-5 grid-cols-3 dark:bg-zinc-800 black:bg-black ${checkThemeStatus}`}
      >
        <div className="col-span-2 lg:inline-block hidden relative pb-5 px-7 space-y-3 no-scrollbar max-h-[calc(100vh-5rem)]">
          <Lists />
        </div>
        <div className="col-span-3 xl:px-0 lg:px-0 lg:pr-5 px-5 md:max-h-[calc(100vh-5rem)] select-none">
          {/* <img src="" alt="Banner" /> */}
          <Docs />
        </div>
        <div className="col-span-2 hidden xl:inline-block relative px-5 pt-5 space-y-3 overflow-y-scroll max-h-screen no-scrollbar">
          <div className="h-[calc(100%-4rem)] w-full border-2 dark:border-zinc-600 rounded-md overflow-hidden">
            <DocScreen
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
