import { ListCard } from "@/components";
import useListStore from "@/store/listStore";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import getErrorFromAxios from "@/utils/getErrorFromAxios";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Lists = () => {
  const [loading, setLoading] = useState(true);
  const { setLists, lists } = useListStore();
  const {toggleModal} = useMethodStore()
  const {profile} = useProfileStore()
  const theme = profile.profile.theme

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
        const errorMsg = getErrorFromAxios(error as AxiosError);
        if (errorMsg !== undefined) {
          toast.error(errorMsg);
        }
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

  if(lists.length == 0) {
    return (
      <div className="dark:text-zinc-200 select-none text-zinc-900 h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)] w-full flex justify-center items-center">
        No lists found. Please create a new one.
      </div>
    );
  }

  return (
    <>
      <div className="col-span-2 relative lg:px-0 px-4 space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]">
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
            font={list.font}
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
