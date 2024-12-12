import { ListCard } from "@/components";
import { fetchedListType } from "@/lib/types";
import useListStore from "@/store/listStore";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"

type ListsProps = {
  className?: string;
  extraElementClassNames?: string
}

const Lists = ({ className, extraElementClassNames }: ListsProps) => {
  const [loading, setLoading] = useState(true);
  const { setLists, lists, setInbox } = useListStore();
  const { toggleModal } = useMethodStore();
  const { profile } = useProfileStore();
  const { theme, font } = profile;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (profile._id !== "") {
        try {
          setLoading(true);

          if (!lists.length) {
            const response: AxiosResponse = await axios({
              method: "GET",
              url: `${import.meta.env.VITE_SERVER_API_URL}/lists/u`,
              withCredentials: true,
            });

            if (!response) {
              toast.error("Failed to fetch user's lists.");
              return;
            }
            const allLists = response.data.data;
            const inboxList = allLists.find((list: fetchedListType) => list.isInbox === true);
            const regularLists = allLists.filter((list: fetchedListType) => list.isInbox === false);

            setLists(regularLists);
            setInbox(inboxList)
          }
        } catch (error) {
          handleAxiosError(error as AxiosError, navigate);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [setLists]);

  if (loading) {
    return (
      <div className={`col-span-2 relative lg:px-0 px-4 space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-4.5rem)] md:h-auto lg:h-[calc(100vh-4.5rem)] md:space-x-0 md:space-y-2 md:p-4 !gap-2 md:justify-start md:items-start 2xl:grid-cols-1 ${className}`}>
        <Skeleton className={`w-full h-64`} />
        <Skeleton className={`w-full h-64`} />
        <Skeleton className={`w-full h-64`} />
      </div>
    );
  }

  if (lists.length == 0) {
    return (
      <div className={`dark:text-zinc-200 select-none text-zinc-900 h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)] w-full flex justify-center items-center ${className}`}>
        No lists found. Please create a new one.
      </div>
    );
  }

  return (
    <>
      <div className={`col-span-2 relative lg:px-0 px-4 space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-4.5rem)] md:h-auto lg:h-[calc(100vh-4.5rem)] md:space-x-0 md:space-y-2 md:p-4 !gap-2 md:justify-start md:items-start 2xl:grid-cols-1 ${className}`}>
        <div className={`h-2 md:hidden ${extraElementClassNames}`}></div>
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
        <div className="lg:h-2 h-16 md:hidden"></div>
      </div>
    </>
  );
};

export default Lists;
