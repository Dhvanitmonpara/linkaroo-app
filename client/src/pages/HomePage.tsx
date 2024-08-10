import { useNavigate } from "react-router-dom";
import {
  DocCard,
  ListCard,
  Header,
  HorizontalTabs,
  ProfileCard,
  DocScreen
} from "../components";
import { ReactNode, useEffect, useRef, useState } from "react";
import axios from "axios";
import useProfileStore from "@/store/profileStore";
import toggleThemeModeAtRootElem from "@/utils/toggleThemeMode";
import { themeType } from "@/lib/types";

function App() {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string | ReactNode>("");

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current === e.target) {
      setIsModalOpen(false);
      navigate("/");
      setModalContent("");
    }
  };

  const { profile, changeTheme } = useProfileStore();
  const { theme } = profile;
  const checkThemeStatus = theme == "black" ? "!bg-black !text-while" : "";

  const themeHandler = (theme: themeType) => {
    changeTheme(theme);
    if (theme == "black") {
      toggleThemeModeAtRootElem("dark");
    } else {
      toggleThemeModeAtRootElem(theme);
    }
  };

  document.addEventListener("keydown", ({ key }) => {
    if (key == "Escape" && isModalOpen) {
      setIsModalOpen(false);
      navigate("/");
    }
  });

  useEffect(() => {
    (async () => {
      try {
        console.log(import.meta.env.VITE_SERVER_API_URL);

        const currentUser = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}/users/current-user`
        );
        //  const currentUser = await axios.get('http://localhost:8000/api/v1/users/current-user');

        console.log(currentUser);

        if (currentUser.data == "Unauthorized request") {
          navigate("/login");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    })();
  });

  return (
    <>
      <div
        className={`grid xl:grid-cols-7 lg:grid-cols-5 grid-cols-3 dark:bg-zinc-800 black:bg-black ${checkThemeStatus}`}
      >
        <div className="col-span-2 lg:inline-block hidden relative py-5 px-7 space-y-3 no-scrollbar max-h-screen">
          <div className="border-2 top-0 h-12 dark:bg-zinc-800 z-20 dark:border-zinc-700 rounded flex justify-center px-7 items-center">
            <span className="font-mono select-none font-black text-2xl dark:text-zinc-300">
              Linkaroo
            </span>
          </div>
          <div className="col-span-2 relative space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-5rem)]">
            <ListCard
              tagname="Hello"
              description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
              title="Hellow"
              color="bg-red-400"
              isBlackMode={theme == "black" ? true : false}
              setIsModalOpen={setIsModalOpen}
            />
            <ListCard
              tagname="lol"
              description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
              title="lol"
              color="bg-emerald-400"
              isBlackMode={theme == "black" ? true : false}
              setIsModalOpen={setIsModalOpen}
            />
            <ListCard
              tagname="Hello"
              description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
              title="Hellow"
              color="bg-amber-400"
              isBlackMode={theme == "black" ? true : false}
              setIsModalOpen={setIsModalOpen}
            />
            <ListCard
              tagname="Hello"
              description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
              title="Hellow"
              color="bg-sky-400"
              isBlackMode={theme == "black" ? true : false}
              setIsModalOpen={setIsModalOpen}
            />
            <ListCard
              tagname="Hello"
              description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
              title="Hellow"
              isBlackMode={theme == "black" ? true : false}
              color="bg-purple-400"
              setIsModalOpen={setIsModalOpen}
            />
            <ListCard
              tagname="Hello"
              description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
              title="Hellow"
              isBlackMode={theme == "black" ? true : false}
              color="bg-green-400"
              setIsModalOpen={setIsModalOpen}
            />
            <div className="h-2"></div>
          </div>
        </div>
        <div className="col-span-3 xl:px-0 lg:px-0 lg:pr-5 px-5 md:max-h-screen">
          <Header
            theme={theme}
            setIsModalOpen={setIsModalOpen}
            setModalContent={setModalContent}
          />
          {/* <img src="" alt="Banner" /> */}
          <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <DocCard
              title="kya hua"
              text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aliquam corrupti corporis repudiandae magnam sapiente quas saepe vero enim ex, aperiam, quaerat consequuntur quidem! Ullam voluptate nam voluptas error quaerat."
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
              setIsModalOpen={setIsModalOpen}
            />
            <div className="h-2"></div>
          </div>
        </div>
        <div className="lg:hidden md:fixed bottom-0 px-0 dark:text-zinc-400 justify-center items-center flex w-screen h-16">
          <HorizontalTabs />
        </div>
        <div className="col-span-2 hidden xl:inline-block relative px-5 pt-5 space-y-3 overflow-y-scroll max-h-screen no-scrollbar">
          <div
            className={`sticky top-0 z-20 border-2 dark:text-white dark:bg-zinc-800 bg-white text-black border-zinc-200 dark:border-zinc-700 rounded-md`}
          >
            <ProfileCard
              theme={theme}
              setIsModalOpen={setIsModalOpen}
              setModalContent={setModalContent}
              themeHandler={themeHandler}
            />
          </div>
          <div className="h-[calc(100%-4rem)] w-full border-2 dark:border-zinc-600 rounded-md overflow-hidden">
            <DocScreen
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
            />
          </div>
        </div>
      </div>
      {/* TODO: Make a sapretate component */}
      {isModalOpen && (
        <div
          ref={modalRef}
          onClick={(e) => closeModal(e)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop:blur-sm flex justify-end items-end md:justify-center md:items-center"
        >
          <div className="xl:h-3/6 xl:w-5/12 lg:w-6/12 md:h-3/6 md:w-8/12 h-4/6 w-screen bg-zinc-100 dark:bg-zinc-800 rounded-xl">
            {modalContent}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
