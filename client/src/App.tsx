import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import useMethodStore from "./store/MethodStore";
import useProfileStore from "./store/profileStore";
import { useMediaQuery } from "react-responsive";
import axios, { AxiosError } from "axios";
import toggleThemeModeAtRootElem from "./utils/toggleThemeMode";
import { Header, HorizontalTabs, Loading, Modal } from "./components";
import useListStore from "./store/listStore";
import useDocStore from "./store/docStore";
import { handleAxiosError } from "./utils/handlerAxiosError";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  const modalRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(33);

  const { isModalOpen, setModalContent, toggleModal, modalContent, prevPath } =
    useMethodStore();
  const { addProfile, profile } = useProfileStore();
  const { setLists } = useListStore();
  const { setDocs, setCurrentListItem } = useDocStore();

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
        setCurrentListItem(null);

        const currentUser = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_SERVER_API_URL}/users/current-user`,
          withCredentials: true,
        });

        setProgress(78);

        addProfile(currentUser.data.data);

        if (isSmallScreen) {
          navigate("/list");
        }
      } catch (error) {
        handleAxiosError(error as AxiosError, navigate);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const theme = profile?.theme;

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
    return <Loading progress={progress} />;
  }

  return (
    <div className="min-h-screen w-screen">
      <div
        className={`p-0 w-full min-h-[calc(100vh-env(safe-area-inset-top))] ${
          theme === "black" ? "bg-black" : "dark:bg-[#1e1e22]"
        }`}
      >
        <div
          className={`w-full ${
            theme === "black" ? "bg-black" : "dark:bg-[#1e1e22]"
          } ${showBars ? "hidden" : ""}`}
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
