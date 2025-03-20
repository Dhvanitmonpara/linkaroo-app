import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import axios, { AxiosError } from "axios";
import toggleThemeModeAtRootElem from "@/utils/toggleThemeMode";
import { Header, HorizontalTabs, Loading } from "@/components/general";
import { initializeSocket } from "@/utils/initializeSocket";
import { useUser } from "@clerk/clerk-react";

const AppLayout = () => {
  const { isSignedIn, isLoaded, user } = useUser()

  const [loading, setLoading] = useState<"loading" | "loaded" | "fetched">("loading");
  const navigate = useNavigate();

  const {
    notifications,
    setNotifications,
  } = useMethodStore();
  const { addProfile, profile } = useProfileStore();

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
        if (!isLoaded) {
          if (!isSignedIn) {
            navigate("/auth/signin")
          }
          return
        }
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) {
          navigate("/auth/signin")
          return
        }
        
        const currentUser = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_SERVER_API_URL}/users/current/${email}`,
          withCredentials: true,
        });

        if (currentUser.status !== 200) {
          navigate("/auth/createuser")
          toast.error("User not found")
          return
        }

        if (currentUser.data.data) {
          addProfile(currentUser.data.data);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.status === 401) {
          navigate("/auth/createuser")
        } else {
          console.error(error);
          toast.error("Error while fetching user")
        }
      } finally {
        setLoading("fetched")
        setTimeout(() => setLoading("loaded"), 500)
      }
    })();
  }, [addProfile, isLoaded, isSignedIn, navigate, user?.primaryEmailAddress?.emailAddress]);

  const theme = profile?.theme;

  useEffect(() => {
    toggleThemeModeAtRootElem(theme);
  }, [theme]);

  if (loading !== "loaded") {
    return <Loading isLoading={loading} />;
  }

  return (
    <div className="min-h-screen w-screen">
      <div
        className={`p-0 w-full min-h-[calc(100vh-env(safe-area-inset-top))] bg-zinc-900`}
      >
        <div
          className={`w-full}`}
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <Header />
        </div>
        <Outlet />
      </div>
      <div
        className={`fixed z-30 bottom-0 px-0 dark:text-zinc-400 bg-zinc-900 sm:!bg-transparent justify-center items-center flex w-screen h-16 lg:hidden`}
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

export default AppLayout;
