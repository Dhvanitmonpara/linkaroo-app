import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { Header, HorizontalTabs, Loading, Modal } from "./components";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useMethodStore from "./store/MethodStore";
import toggleThemeModeAtRootElem from "./utils/toggleThemeMode";
import useProfileStore from "./store/profileStore";
import { useMediaQuery } from "react-responsive";
import axios, { AxiosError } from "axios";
import getErrorFromAxios from "./utils/getErrorFromAxios";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { isModalOpen, setModalContent, toggleModal, modalContent } =
    useMethodStore();

  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  const { profile, addProfile } = useProfileStore();
  const { theme } = profile.profile;

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current === e.target) {
      toggleModal(false);
      navigate("/");
      setModalContent(null);
    }
  };

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

  useEffect(() => {
    if (theme == "black") {
      toggleThemeModeAtRootElem("dark");
    } else {
      toggleThemeModeAtRootElem(theme);
    }
  }, [theme]);

  const location = useLocation().pathname;
  const showBars =
    location.includes("/login") ||
    location.includes("/signup") ||
    location.includes("/forgot-password");

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-screen">
      <div
        className={`md:hidden sticky top-0 z-40 w-full bg-zinc-800 ${
          showBars ? "hidden" : ""
        }`}
      >
        <Header />
      </div>
      <div className="p-0 w-full h-full dark:bg-zinc-800">
        <Outlet />
      </div>
      <div
        className={`lg:hidden fixed z-30 md:fixed bottom-0 px-0 dark:text-zinc-400 dark:bg-zinc-800 justify-center items-center flex w-screen h-16 ${
          showBars ? "hidden" : ""
        }`}
      >
        <HorizontalTabs />
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          modalContent={modalContent}
          modalRef={modalRef}
          className="xl:h-auto w-full max-w-4xl"
        />
      )}
      <Toaster
        position={window.innerWidth >= 1024 ? "bottom-right" : "top-center"}
      />
    </div>
  );
};

export default App;
