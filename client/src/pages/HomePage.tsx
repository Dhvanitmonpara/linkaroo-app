import { useLocation } from "react-router-dom";
import { DocScreen, Lists, Docs } from "../components";
import useProfileStore from "@/store/profileStore";

function App() {
  const { profile } = useProfileStore();
  const { theme } = profile;
  const checkThemeStatus = theme == "black" ? "!bg-black !text-while" : "";
  const location = useLocation().pathname;

  return (
    <>
      <div
        className={`grid xl:grid-cols-7 lg:grid-cols-5 grid-cols-3 ${checkThemeStatus}`}
      >
        <div className="col-span-2 lg:inline-block hidden relative pb-5 px-7 space-y-3 no-scrollbar max-h-[calc(100vh-5rem)]">
          <Lists />
        </div>
        <div
          className={`xl:px-0 lg:px-0 lg:pr-5 px-5 h-full select-none ${
            !location.includes("/docs")
              ? "lg:col-span-3 xl:col-span-5 !pr-5"
              : "col-span-3"
          }`}
        >
          <Docs />
        </div>
        <div
          className={`col-span-2 hidden xl:inline-block relative px-5 pt-5 space-y-3 overflow-y-scroll max-h-screen no-scrollbar ${
            !location.includes("/docs") ? "!hidden" : ""
          }`}
        >
          {location.includes("/docs") ? (
            <div className="h-full w-full border-2 dark:border-zinc-600 rounded-md overflow-hidden">
              <DocScreen/>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default App;
