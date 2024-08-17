import { Link, useNavigate } from "react-router-dom";
import {
  Header,
  ProfileCard,
  DocScreen,
  Lists,
  Docs,
  Loading,
} from "../components";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import useProfileStore from "@/store/profileStore";
import toast from "react-hot-toast";
import getErrorFromAxios from "@/utils/getErrorFromAxios";
import useMethodStore from "@/store/MethodStore";
import { useMediaQuery } from "react-responsive";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { isModalOpen, toggleModal, setModalContent } = useMethodStore();

  const { profile, addProfile } = useProfileStore();
  const { theme } = profile.profile;
  const checkThemeStatus = theme == "black" ? "!bg-black !text-while" : "";
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  document.addEventListener("keydown", ({ key }) => {
    if (key == "Escape" && isModalOpen) {
      toggleModal(false);
      navigate("/");
      setModalContent("");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_SERVER_API_URL}/users/current-user`,
          withCredentials: true,
        });

        if (currentUser.data == "Unauthorized request") {
          navigate("/login");
          return;
        }

        addProfile(currentUser.data.data);

        if (isSmallScreen) {
          navigate("/list");
        }
      } catch (error) {
        const errorMsg = getErrorFromAxios(error as AxiosError);
        if (errorMsg === "Unauthorized request") {
          navigate("/login");
        } else if (errorMsg !== undefined) {
          toast.error((t) => (
            <span className="space-x-3">
              <span>{errorMsg}</span>
              <button
                className="bg-red-500 text-white font-semibold hover:underline h-full w-auto rounded-sm py-1 px-3"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/login");
                }}
              >
                Login again
              </button>
            </span>
          ));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }

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
          <Lists theme={theme} />
        </div>
        <div className="col-span-3 xl:px-0 lg:px-0 lg:pr-5 px-5 md:max-h-screen">
          <Header />
          {/* <img src="" alt="Banner" /> */}
          <Docs theme={theme} />
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
