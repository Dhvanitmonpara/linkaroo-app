import { ListCard } from "@/components";
import useListStore from "@/store/listStore";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CreateListForm } from "./Forms";

const Lists = () => {
  const [loading, setLoading] = useState(true);
  const { setLists, lists } = useListStore();
  const { toggleModal, setModalContent } = useMethodStore();
  const { profile } = useProfileStore();
  const { theme, font } = profile.profile;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const response: AxiosResponse = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_SERVER_API_URL}/lists/u`,
          withCredentials: true,
        });

        if (!response) {
          toast.error("Failed to fetch user's lists.");
          return;
        }

        setLists(response.data.data);
      } catch (error) {
        handleAxiosError(error as AxiosError, navigate);
      } finally {
        setLoading(false);
      }
    })();
  }, [setLists]);

  if (loading) {
    return (
      <div className="dark:text-zinc-200 text-zinc-900 h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)] w-full flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (lists.length == 0) {
    return (
      <div className="dark:text-zinc-200 select-none text-zinc-900 h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)] w-full flex justify-center items-center">
        No lists found. Please create a new one.
      </div>
    );
  }

  return (
    <>
      <div className="col-span-2 relative lg:px-0 px-4 space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]">
        <div className="h-2"></div>
        <div
          onClick={() => {
            setModalContent(
              <CreateListForm toggleModal={toggleModal} theme={theme} />
            );
            toggleModal(true);
          }}
          className="h-11 w-full p-4 flex justify-start items-center space-x-2 border-[1px] text-zinc-300 md:text-zinc-400 md:dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:text-white md:border-2 md:dark:border-zinc-700 md:border-zinc-200 hover:bg-zinc-200 rounded-sm transition-colors cursor-pointer"
        >
          <IoMdAdd />
          <span>Create List</span>
        </div>
        {lists.map((list, index) => (
          <ListCard
            key={index}
            id={list._id}
            title={list.title}
            description={list.description}
            tagname={list.tags}
            collaborators={list.collaborators}
            createdBy={list.createdBy}
            theme={list.theme}
            font={font}
            isBlackMode={theme == "black" ? true : false}
            toggleModal={toggleModal}
          />
        ))}
        <div className="lg:h-2 h-16"></div>
      </div>
    </>
  );
};

export default Lists;
