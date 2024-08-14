import { Outlet } from "react-router-dom";
import "./App.css";
import { HorizontalTabs } from "./components";

const App = () => {
  return (
    <div className="h-screen">
      <Outlet />
      <div className="lg:hidden md:fixed bottom-0 px-0 dark:text-zinc-400 dark:bg-zinc-800 justify-center items-center flex w-screen h-16">
        <HorizontalTabs />
      </div>
    </div>
  );
};

export default App;
