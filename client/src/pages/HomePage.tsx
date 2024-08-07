import { useNavigate } from "react-router-dom";
import { DocCard, ListCard, Header } from "../components";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useProfileStore from "@/store/profileStore";

function App() {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current === e.target) {
      setIsModalOpen(false);
      navigate("/");
    }
  };

  // const { profile } = useProfileStore();
  const { profile, changeTheme } = useProfileStore();

  // changeTheme("black")
  const { theme } = profile;
  const checkThemeStatus = theme == "black" ? "!bg-black !text-while" : ""

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
      <div className={`grid grid-cols-7 dark:bg-zinc-800 black:bg-black ${checkThemeStatus}`}>
        <div className="col-span-2 py-5 px-7 space-y-3 overflow-y-scroll no-scrollbar max-h-screen">
          <div className="border-2 dark:border-gray-400 rounded flex justify-center items-center">
            <span className="font-mono select-none font-black text-2xl dark:text-white">
              Linkaroo
            </span>
            <button className="text-white" onClick={()=>{changeTheme("black")}}>
              change theme
            </button>
          </div>
          <ListCard
            tagname="Hello"
            description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
            title="Hellow"
            color={theme == "black" ? "bg-black" : "bg-red-400"}
            setIsModalOpen={setIsModalOpen}
          />
          <ListCard
            tagname="lol"
            description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
            title="lol"
            color={theme == "black" ? "bg-black" : "bg-emerald-400"}
            setIsModalOpen={setIsModalOpen}
          />
          <ListCard
            tagname="Hello"
            description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
            title="Hellow"
            color={theme == "black" ? "bg-black" : "bg-amber-400"}
            setIsModalOpen={setIsModalOpen}
          />
          <ListCard
            tagname="Hello"
            description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
            title="Hellow"
            color={theme == "black" ? "bg-black" : "bg-sky-400"}
            setIsModalOpen={setIsModalOpen}
          />
          <ListCard
            tagname="Hello"
            description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
            title="Hellow"
            color={theme == "black" ? "bg-black" : "bg-purple-400"}
            setIsModalOpen={setIsModalOpen}
          />
          <ListCard
            tagname="Hello"
            description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit"
            title="Hellow"
            color={theme == "black" ? "bg-black" : "bg-green-400"}
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
        <div className="col-span-2 px-5 overflow-y-scroll max-h-screen no-scrollbar">
          <div className="min-h-full w-full border-2"></div>
        </div>
      </div>
      {isModalOpen && (
        <div
          ref={modalRef}
          onClick={(e) => closeModal(e)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop:blur-sm flex justify-center items-center"
        >
          <div className="h-3/6 w-5/12 bg-zinc-100 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      )}
    </>
  );
}

export default App;
