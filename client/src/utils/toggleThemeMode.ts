import { themeType } from "@/lib/types";

const toggleThemeMode = (
  theme: themeType,
  setThemeMode: (theme: themeType) => void
) => {
  const rootElem = document.getElementById("root");
  rootElem?.classList.remove("dark", "light", "black");
  rootElem?.classList.add(theme);
  setThemeMode(theme);
};

export default toggleThemeMode;
