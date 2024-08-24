import { DocCard, ListActionButtons } from "@/components";
import useDocStore from "@/store/docStore";
import useListStore from "@/store/listStore";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import getErrorFromAxios from "@/utils/getErrorFromAxios";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Docs = () => {
  const { toggleModal } = useMethodStore();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { docs, setDocs, currentListItem, setCurrentListItem } = useDocStore();
  const {lists} = useListStore()
  const { profile } = useProfileStore();
  const { theme, font } = profile.profile;
  const { currentCardColor } = useMethodStore();

  useEffect(() => {
    (async () => {
      if (location.pathname.includes("/lists")) {
        try {
          setLoading(true);
          const listId = location.pathname.split("/")[2];

          const response: AxiosResponse = await axios.get(
            `${import.meta.env.VITE_SERVER_API_URL}/cards/${listId}`,
            { withCredentials: true }
          );
          
          if (!response.data.data) {
            toast.error("Failed to fetch list details");
            return;
          }
          
          const currentListRes = await lists.filter(list => list._id === listId)[0]
          setCurrentListItem(currentListRes);

          setDocs(response.data.data);
        } catch (error) {
          const errorMsg = getErrorFromAxios(error as AxiosError);
          if (errorMsg != undefined) {
            toast.error(errorMsg);
          }
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [location, setDocs]);

  if (loading) {
    return (
      <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-9rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
        <div className="dark:text-white h-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
        ;
      </div>
    );
  }

  if (docs.length == 0) {
    return (
      <div className={`md:h-[calc(100vh-5rem)] select-none h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-9rem)] overflow-y-hidden w-full space-y-2 no-scrollbar ${font}`}>
        <div className="bg-green-400 h-48 w-full relative p-4 rounded-md">
          <div className="flex justify-between items-center w-full h-10 absolute bottom-5 left-0 px-4">
            <h1 className="text-2xl font-semibold">{currentListItem?.title}</h1>
            <ListActionButtons listTitle={currentListItem?.title} />
          </div>
          <div>
            {currentListItem?.description}
          </div>
        </div>
        <div className="dark:text-zinc-200 h-[30rem] flex justify-center items-center flex-col space-y-2">
          <h1 className="text-2xl text-center">
            {docs.length == 0
              ? "No documents available"
              : "This list consists 0 docs"}
          </h1>
          <p>{docs.length == 0 ? "Create some" : "Select docs to see"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:h-[calc(100vh-5rem)] md:px-0 px-4 h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-9rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
      <div className="h-48 w-full py-2">
        <div className="bg-green-400 h-full w-full relative p-4 rounded-md">
          <div className="flex justify-between items-center w-full h-10 absolute bottom-5 left-0 px-4">
            <h1 className="text-2xl font-semibold">{currentListItem?.title}</h1>
            <ListActionButtons listTitle={currentListItem?.title} />
          </div>
          <div>
            {currentListItem?.description}
          </div>
        </div>
      </div>
      {docs?.map((doc) => (
        <DocCard
          key={doc._id}
          title={doc.title}
          color={theme == "black" ? "bg-black" : currentCardColor}
          link={doc.link}
          toggleModal={toggleModal}
        />
      ))}
      <div className="lg:h-2 h-16"></div>
    </div>
  );
};

export default Docs;
