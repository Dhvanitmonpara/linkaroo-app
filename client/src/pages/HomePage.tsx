import { Link, useNavigate } from "react-router-dom";
import { Header, ProfileCard, DocScreen, Lists, Docs } from "../components";
import useProfileStore from "@/store/profileStore";
import useMethodStore from "@/store/MethodStore";

function App() {
  const navigate = useNavigate();
  const { isModalOpen, toggleModal, setModalContent } = useMethodStore();

  const { profile } = useProfileStore();
  const { theme } = profile.profile;
  const checkThemeStatus = theme == "black" ? "!bg-black !text-while" : "";

  document.addEventListener("keydown", ({ key }) => {
    if (key == "Escape" && isModalOpen) {
      toggleModal(false);
      navigate("/");
      setModalContent("");
    }
  });

  return (
    <>
      <div
        className={`grid xl:grid-cols-7 lg:grid-cols-5 grid-cols-3 dark:bg-zinc-800 black:bg-black ${checkThemeStatus}`}
      >
        <div className="col-span-2 lg:inline-block hidden relative py-5 px-7 space-y-3 no-scrollbar max-h-screen">
          <div className="border-2 top-0 h-12 dark:bg-zinc-800 z-20 dark:border-zinc-700 rounded flex justify-center px-7 items-center">
            <Link
              to="/"
              className="font-mono select-none font-black text-2xl dark:text-zinc-300"
            >
              Linkaroo
            </Link>
          </div>
          <Lists />
        </div>
        <div className="col-span-3 xl:px-0 lg:px-0 lg:pr-5 px-5 md:max-h-screen">
          <div className="hidden lg:block">
            <Header />
          </div>
          {/* <img src="" alt="Banner" /> */}
          <Docs />
        </div>
        <div className="col-span-2 hidden xl:inline-block relative px-5 pt-5 space-y-3 overflow-y-scroll max-h-screen no-scrollbar">
          <div
            className={`sticky top-0 z-20 border-2 dark:text-white dark:bg-zinc-800 bg-white text-black border-zinc-200 dark:border-zinc-700 rounded-md`}
          >
            <ProfileCard
              theme={theme}
              toggleModal={toggleModal}
              setModalContent={setModalContent}
              profile={profile}
            />
          </div>
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
