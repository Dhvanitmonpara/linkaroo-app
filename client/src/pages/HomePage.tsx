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

function App() {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string | ReactNode>("");

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current === e.target) {
      setIsModalOpen(false);
      navigate("/");
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
        className={`grid grid-cols-7 dark:bg-zinc-800 black:bg-black ${checkThemeStatus}`}
      >
        <div className="col-span-2 relative py-5 px-7 space-y-3 overflow-y-scroll no-scrollbar max-h-screen">
          <div className="border-2 top-0 sticky h-12 dark:bg-zinc-800 z-20 dark:border-zinc-700 rounded flex justify-center items-center">
            <span className="font-mono select-none font-black text-2xl dark:text-zinc-300">
              Linkaroo
            </span>
          </div>
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
        <div className="col-span-3 max-h-screen">
          <Header />
          <div className="h-[calc(100vh-5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
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
        </div>
        <div className="col-span-2 relative px-5 pt-5 space-y-3 overflow-y-scroll max-h-screen no-scrollbar">
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
                  </div>
                );
              }}
            >
              Dhvanit Monpara
            </button>
          </div>
          <div className="min-h-[calc(100%-4rem)] pb-5 w-full border-2 p-5 dark:border-zinc-600">
            {/* TODO: add menu here */}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          ref={modalRef}
          onClick={(e) => closeModal(e)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop:blur-sm flex justify-center items-center"
        >
          <div className="h-3/6 w-5/12 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
            {modalContent}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
