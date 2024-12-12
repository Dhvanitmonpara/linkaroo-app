import { ListCard } from "@/components";
import { fetchedCollectionType } from "@/lib/types";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"
import useCollectionsStore from "@/store/collectionStore";

type CollectionsProps = {
  className?: string;
  extraElementClassNames?: string
}

const Collections = ({ className, extraElementClassNames }: CollectionsProps) => {
  const [loading, setLoading] = useState(true);
  const { setCollections, collections, setInbox } = useCollectionsStore();
  const { toggleModal } = useMethodStore();
  const { profile } = useProfileStore();
  const { theme, font } = profile;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (profile._id !== "") {
        try {
          setLoading(true);

          if (!collections.length) {
            const response: AxiosResponse = await axios({
              method: "GET",
              url: `${import.meta.env.VITE_SERVER_API_URL}/collection/u`,
              withCredentials: true,
            });

            if (!response) {
              toast.error("Failed to fetch user's collections.");
              return;
            }
            const allCollections = response.data.data;
            const inboxCollection = allCollections.find((collection: fetchedCollectionType) => collection.isInbox === true);
            const regularCollections = allCollections.filter((collection: fetchedCollectionType) => collection.isInbox === false);

            setCollections(regularCollections);
            setInbox(inboxCollection)
          }
        } catch (error) {
          handleAxiosError(error as AxiosError, navigate);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [setCollections]);

  if (loading) {
    return (
      <div className={`col-span-2 relative lg:px-0 px-4 space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-4.5rem)] md:h-auto lg:h-[calc(100vh-4.5rem)] md:space-x-0 md:space-y-2 md:p-4 !gap-2 md:justify-start md:items-start 2xl:grid-cols-1 ${className}`}>
        <Skeleton className={`w-full h-64`} />
        <Skeleton className={`w-full h-64`} />
        <Skeleton className={`w-full h-64`} />
      </div>
    );
  }

  if (collections.length == 0) {
    return (
      <div className={`dark:text-zinc-200 select-none text-zinc-900 h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)] w-full flex justify-center items-center ${className}`}>
        No Collections found. Please create a new one.
      </div>
    );
  }

  return (
    <>
      <div className={`col-span-2 relative lg:px-0 px-4 space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-4.5rem)] md:h-auto lg:h-[calc(100vh-4.5rem)] md:space-x-0 md:space-y-2 md:p-4 !gap-2 md:justify-start md:items-start 2xl:grid-cols-1 ${className}`}>
        <div className={`h-2 md:hidden ${extraElementClassNames}`}></div>
        {collections.map((collections, index) => (
          <ListCard
            key={index}
            id={collections._id}
            title={collections.title}
            description={collections.description}
            tagname={collections.tags}
            collaborators={collections.collaborators}
            createdBy={collections.createdBy}
            theme={collections.theme}
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

export default Collections;
