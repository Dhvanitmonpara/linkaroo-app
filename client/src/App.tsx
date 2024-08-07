import { Outlet } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import { themeType } from "./lib/types";
import useProfileStore from "./store/profileStore";
import toggleThemeMode from "./utils/toggleThemeMode";

const App = () => {
  const [themeMode, setThemeMode] = useState<themeType>("light");

  const { updateProfile } = useProfileStore();

  toggleThemeMode("black", setThemeMode);

  useEffect(() => {
    updateProfile({theme: themeMode})
  }, [themeMode, updateProfile]);

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default App;
