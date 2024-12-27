import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import useMethodStore from "./store/MethodStore";
import useProfileStore from "./store/profileStore";
import axios, { AxiosError } from "axios";
import toggleThemeModeAtRootElem from "./utils/toggleThemeMode";
import { Header, HorizontalTabs, Loading } from "./components";
import { handleAxiosError } from "./utils/handlerAxiosError";
import { initializeSocket } from "./utils/initializeSocket";
import useCollectionsStore from "./store/collectionStore";
import useLinkStore from "./store/linkStore";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    isModalOpen,
    setModalContent,
    toggleModal,
    prevPath,
    notifications,
    setNotifications,
  } = useMethodStore();
  const { addProfile, profile } = useProfileStore();
  const { setCollections, setInboxLink, setInbox } = useCollectionsStore();
  const { setLinks, setCurrentCollectionItem, setCachedLinks } = useLinkStore();

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
    const socket = initializeSocket(profile._id);

    socket.on("userConnected", () => {
      console.log("Socket connected");
    });

    socket.on("pendingNotifications", (newNotifications) => {
      setNotifications([...notifications, ...newNotifications]);
    });

    socket.on("userDisconnected", (data) => {
      console.log(`User ${data.userId} is offline`);
    });

    return () => {
      socket.disconnect();
    };
  }, [profile._id, notifications, setNotifications]);

  useEffect(() => {
    (async () => {
      try {
        setCollections([]);
        setInbox(null);
        setLinks([]);
        setInboxLink([]);
        setCachedLinks([]);
        addProfile({
          _id: "",
          username: "",
          email: "",
          fullName: "",
          avatarImage: "",
          coverImage: "",
          theme: "dark",
          font: "font-sans",
          createdAt: "",
          updatedAt: "",
          _v: 0,
        });
        setCurrentCollectionItem(null);

        const currentUser = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_SERVER_API_URL}/users/current-user`,
          withCredentials: true,
        });

        if (currentUser.data.data) {
          addProfile(currentUser.data.data);
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
    toggleThemeModeAtRootElem(theme);
  }, [theme]);

  const showBars =
    location.pathname.includes("/login") ||
    location.pathname.includes("/signup") ||
    location.pathname.includes("/password-recovery");

  if (loading) {
    return <Loading isLoading={loading} />;
  }

  return (
    <div className="min-h-screen w-screen">
      <div
        className={`p-0 w-full min-h-[calc(100vh-env(safe-area-inset-top))] bg-black`}
      >
        <div
          className={`w-full bg-black ${showBars ? "hidden" : ""}`}
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <Header />
        </div>
        <Outlet />
      </div>
      <div
        className={`fixed z-30 bottom-0 px-0 dark:text-zinc-400 bg-black sm:!bg-transparent justify-center items-center flex w-screen h-16 ${showBars ? "hidden" : ""
          } lg:hidden`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <HorizontalTabs />
      </div>
      <Toaster
        position={window.innerWidth >= 1024 ? "bottom-right" : "top-center"}
        toastOptions={{
          style: {
            background: `${theme !== "light" ? "#333" : "#fff"}`,
            color: `${theme !== "light" ? "#fff" : "#333"}`,
          },
        }}
      />
    </div>
  );
};

export default App;
