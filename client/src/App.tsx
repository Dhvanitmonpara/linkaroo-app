import { Outlet } from "react-router-dom";
import "./App.css";
import { Header, HorizontalTabs } from "./components";

const App = () => {
  return (
    <div className="h-screen w-screen">
      <div className="p-0 w-full h-full dark:bg-zinc-800">
        <div className="lg:hidden fixed top-0">
          <Header />
        </div>
        <Outlet />
      </div>
      <div className="lg:hidden fixed z-30 md:fixed bottom-0 px-0 dark:text-zinc-400 dark:bg-zinc-800 justify-center items-center flex w-screen h-16">
        <HorizontalTabs />
      </div>
    </div>
  );
};

export default App;
