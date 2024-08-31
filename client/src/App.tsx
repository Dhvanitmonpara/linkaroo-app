import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useMethodStore from "./store/MethodStore";
import useProfileStore from "./store/profileStore";
import { useMediaQuery } from "react-responsive";
import axios, { AxiosError } from "axios";
import getErrorFromAxios from "./utils/getErrorFromAxios";
import toggleThemeModeAtRootElem from "./utils/toggleThemeMode";
import { Header, HorizontalTabs, Loading, Modal } from "./components";
import useListStore from "./store/listStore";
import useDocStore from "./store/docStore";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  const modalRef = useRef<HTMLDivElement | null>(null);

  const { isModalOpen, setModalContent, toggleModal, modalContent, prevPath } =
    useMethodStore();
  const { addProfile, profile } = useProfileStore();
  const { setLists } = useListStore();
  const { setDocs } = useDocStore();

  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current === e.target) {
      toggleModal(false);
      setModalContent(null);
      if (prevPath !== null) {
        navigate(prevPath);
      }
    }
  };

  document.addEventListener("keydown", ({ key }) => {
    if (key == "Escape" && isModalOpen) {
      toggleModal(false);
      setModalContent("");
      if (prevPath != null) {
        navigate(prevPath);
      }
    }
  });

  useEffect(() => {
    (async () => {
      try {
        setLists([]);
        setDocs([]);

        const currentUser = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_SERVER_API_URL}/users/current-user`,
          withCredentials: true,
        });

        if (currentUser.data === "Unauthorized request") {
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

  const theme = profile?.profile?.theme;

  useEffect(() => {
    if (theme === "black") {
      toggleThemeModeAtRootElem("dark");
    } else {
      toggleThemeModeAtRootElem(theme);
    }
  }, [theme]);

  const showBars =
    location.pathname.includes("/login") ||
    location.pathname.includes("/signup") ||
    location.pathname.includes("/forgot-password");

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-sc w-screen">
      <div
        className={`p-0 w-full min-h-[calc(100vh-env(safe-area-inset-top))] ${
          theme === "black" ? "bg-black" : "dark:bg-zinc-800"
        }`}
      >
        <div
          className={`sticky top-0 z-40 w-full ${
            theme === "black" ? "bg-black" : "dark:bg-zinc-800"
          } ${showBars ? "hidden" : ""} lg:!hidden`}
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <Header />
        </div>
        <Outlet />
      </div>
      <div
        className={`fixed z-30 md:fixed bottom-0 px-0 dark:text-zinc-400 ${
          theme === "black" ? "bg-black" : "dark:bg-zinc-800"
        } sm:!bg-transparent justify-center items-center flex w-screen h-16 ${
          showBars ? "hidden" : ""
        } lg:hidden`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
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
