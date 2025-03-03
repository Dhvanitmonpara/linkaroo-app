import { useLocation } from "react-router-dom";
import { LinkScreen, Collections, Links } from "../components";

function DashboardPage() {
  const location = useLocation().pathname;

  return (
    <>
      <div
        className={`grid xl:grid-cols-7 lg:grid-cols-5 grid-cols-3 !bg-black !text-while`}
      >
        <Collections />
        <Links />
        <div
          className={`col-span-2 hidden xl:inline-block relative px-5 pt-5 space-y-3 overflow-y-scroll max-h-screen no-scrollbar ${!location.includes("/links") ? "!hidden" : ""
            }`}
        >
          {location.includes("/links") ? (
            <div className="h-full w-full border-2 dark:border-zinc-800 rounded-md overflow-hidden">
              <LinkScreen />
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
