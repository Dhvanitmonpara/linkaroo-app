import { useLocation } from "react-router-dom";
import { LinkScreen, Collections, Links } from "../components";

function DashboardPage() {
  const location = useLocation().pathname;

  return (
    <>
      <div
        className={`grid xl:grid-cols-7 lg:grid-cols-5 grid-cols-3 !bg-black !text-while`}
      >
        <div className="col-span-2 lg:inline-block hidden relative px-7 pb-5 lg:pl-7 lg:pr-4 space-y-3 no-scrollbar max-h-[calc(100vh-5rem)]">
          <Collections />
        </div>
        <div
          className={`xl:px-0 lg:px-0 lg:pr-5 px-5 h-full select-none ${
            !location.includes("/links")
              ? "lg:col-span-3 xl:col-span-5 !pr-5"
              : "col-span-3"
          }`}
        >
          <Links />
        </div>
        <div
          className={`col-span-2 hidden xl:inline-block relative px-5 pt-5 space-y-3 overflow-y-scroll max-h-screen no-scrollbar ${
            !location.includes("/links") ? "!hidden" : ""
          }`}
        >
          {location.includes("/links") ? (
            <div className="h-full w-full border-2 dark:border-zinc-800 rounded-md overflow-hidden">
              <LinkScreen/>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
