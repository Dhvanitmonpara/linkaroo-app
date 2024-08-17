import { themeType } from "@/lib/types";

const toggleThemeModeAtRootElem = (
  theme: themeType,
) => {
  const rootElem = document.getElementById("root");
  rootElem?.classList.remove("dark", "light", "black");
  rootElem?.classList.add(theme);
};

export default toggleThemeModeAtRootElem;
