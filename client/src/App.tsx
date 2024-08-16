import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { Header, HorizontalTabs, Modal } from "./components";
import { useRef } from "react";
import { Toaster } from "react-hot-toast";
import useMethodStore from "./store/MethodStore";

const App = () => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { isModalOpen, setModalContent, toggleModal, modalContent } = useMethodStore();

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current === e.target) {
      toggleModal(false);
      navigate("/");
      setModalContent(null); // Ensure setting content to a valid type
    }
  };

  return (
    <div className="h-screen w-screen">
      <div className="lg:hidden fixed top-0 z-40 w-full">
        <Header />
      </div>
      <div className="p-0 w-full h-full dark:bg-zinc-800">
        <Outlet />
      </div>
      <div className="lg:hidden fixed z-30 md:fixed bottom-0 px-0 dark:text-zinc-400 dark:bg-zinc-800 justify-center items-center flex w-screen h-16">
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
