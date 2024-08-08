import { useNavigate } from "react-router-dom";
import { DocCard, ListCard, Header } from "../components";
import { ReactNode, useEffect, useRef, useState } from "react";
import axios from "axios";
import useProfileStore from "@/store/profileStore";
import toggleThemeModeAtRootElem from "@/utils/toggleThemeMode";
import { themeType } from "@/lib/types";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import DocScreen from "@/components/DocScreen";
import { MdHome } from "react-icons/md";
import { IoListSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";

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

  const switchTab = (id: string) => {
    const navTabs = document.querySelectorAll(".nav-tab");
    navTabs?.forEach((tab) => {
      tab.classList.remove("dark:text-white text-black");
    });

    document.getElementById(id)?.classList.add("dark:text-white text-black");
  };

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
          </div>
          <div className="lg:hidden md:fixed bottom-0 dark:text-zinc-400 justify-center items-center px-14 flex w-full h-16">
            <div className="flex justify-between dark:bg-zinc-800 h-full md:px-32 md:w-8/12 rounded-t-xl items-center w-full sm:w-5/12">
              <button
                id="listsTab"
                onClick={() => {switchTab("listsTab")}}
                className="navTabs h-full flex justify-center items-center w-16 cursor-pointer text-xl font-semibold dark:hover:text-white"
                >
                <IoListSharp />
              </button>
              <button
                id="homeTab"
                onClick={() => {switchTab("homeTab")}}
                className="navTabs h-full flex justify-center items-center w-16 cursor-pointer text-xl font-semibold dark:hover:text-white"
                >
                <MdHome />
              </button>
              <button
                id="addTab"
                onClick={() => {switchTab("addTab")}}
                className="navTabs h-full flex justify-center items-center w-16 cursor-pointer text-lg font-semibold dark:hover:text-white"
                >
                <FaPlus />
              </button>
              <button
                id="profileTab"
                onClick={() => {switchTab("profileTab")}}
                className="navTabs h-full flex justify-center items-center w-16 cursor-pointer text-lg font-semibold dark:hover:text-white"
              >
                <IoPerson />
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-2 hidden xl:inline-block relative px-5 pt-5 space-y-3 overflow-y-scroll max-h-screen no-scrollbar">
          <div
            className={`sticky top-0 z-20 border-2 dark:text-white dark:bg-zinc-800 bg-white text-black border-zinc-200 dark:border-zinc-700 rounded-md`}
          >
            <button
              className="w-full dark:text-white py-3 px-6 rounded-md focus:outline-none hover:bg-zinc-200 dark:hover:bg-zinc-700"
              onClick={() => {
                setIsModalOpen(true);
                setModalContent(
                  <div className="flex h-full w-full flex-col justify-center p-5 items-center">
                    <h1 className="dark:text-white text-4xl pb-11">Settings</h1>
                    <div className="flex justify-between w-full">
                      <span className="dark:text-white">Themes:</span>
                      <Select
                        onValueChange={(value: themeType) => {
                          themeHandler(value);
                        }}
                      >
                        <SelectTrigger className="dark:text-white max-w-36">
                          <SelectValue placeholder="Change theme" />
                        </SelectTrigger>
                        <SelectContent
                          className={
                            theme != "light"
                              ? "!bg-black !text-white border-zinc-800"
                              : ""
                          }
                        >
                          <SelectGroup>
                            <SelectLabel>Themes</SelectLabel>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between w-full">
                      <span className="dark:text-white">Fonts:</span>
                      <Select
                        onValueChange={(value: themeType) => {
                          themeHandler(value);
                        }}
                      >
                        <SelectTrigger className="dark:text-white max-w-36">
                          <SelectValue placeholder="Change theme" />
                        </SelectTrigger>
                        <SelectContent
                          className={
                            theme != "light"
                              ? "!bg-black !text-white border-zinc-800"
                              : ""
                          }
                        >
                          <SelectGroup>
                            <SelectLabel>Fonts</SelectLabel>
                            <SelectItem value="light">sans</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              }}
            >
              Dhvanit Monpara
            </button>
          </div>
          <div className="h-[calc(100%-4rem)] w-full border-2 dark:border-zinc-600 rounded-md overflow-hidden">
            <DocScreen
              color={theme == "black" ? "bg-black" : "bg-emerald-400"}
            />
          </div>
        </div>
      </div>
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
