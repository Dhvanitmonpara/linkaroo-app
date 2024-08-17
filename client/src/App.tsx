import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { Header, HorizontalTabs, Modal } from "./components";
import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import useMethodStore from "./store/MethodStore";
import toggleThemeModeAtRootElem from "./utils/toggleThemeMode";
import useProfileStore from "./store/profileStore";

const App = () => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { isModalOpen, setModalContent, toggleModal, modalContent } =
    useMethodStore();

  const { profile } = useProfileStore();
  const { theme } = profile.profile;

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current === e.target) {
      toggleModal(false);
      navigate("/");
      setModalContent(null);
    }
  };

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
