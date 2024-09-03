import { DocCard, ListActionButtons } from "@/components";
import useDocStore from "@/store/docStore";
import useListStore from "@/store/listStore";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { BiSolidPencil } from "react-icons/bi";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import convertMongoDBDate from "@/utils/convertMongoDBDate";

const Docs = () => {
  const { toggleModal } = useMethodStore();
  const [loading, setLoading] = useState(false);
  const location = useLocation().pathname;
  const { docs, setDocs, currentListItem, setCurrentListItem } = useDocStore();
  const { lists } = useListStore();
  const { profile } = useProfileStore();
  const { theme, font } = profile.profile;
  const { currentCardColor } = useMethodStore();
  const navigate = useNavigate();

  // TODO: create a dropdown along with images and custom image function
  const handleEditCoverImage = () => {};

  useEffect(() => {
    (async () => {
      // if (location.pathname.includes("/lists") && prevPath !== location.pathname) {
      if (location.includes("/lists")) {
        try {
          setLoading(true);
          const listId = location.split("/")[2];
          const response: AxiosResponse = await axios.get(
            `${import.meta.env.VITE_SERVER_API_URL}/cards/${listId}`,
            { withCredentials: true }
          );

          if (!response.data.data) {
            toast.error("Failed to fetch list details");
            return;
          }

          const currentListRes = await lists.filter(
            (list) => list._id === listId
          )[0];
          setCurrentListItem(currentListRes);

          setDocs(response.data.data);
        } catch (error) {
          handleAxiosError(error as AxiosError, navigate);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [lists, currentCardColor, setDocs, setCurrentListItem]);

  if (loading) {
    return (
      <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
        <div className="dark:text-white h-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  const coverImageStyle = {
    backgroundImage: `url('${currentListItem?.coverImage}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  if (docs.length == 0) {
    return (
      <div
        className={`md:h-[calc(100vh-5rem)] select-none h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-hidden w-full space-y-2 no-scrollbar ${font}`}
      >
        <div className="h-48 w-full py-2">
          <div
            className="h-full w-full relative overflow-hidden rounded-md"
            style={coverImageStyle}
          >
            <div className="h-full w-full bg-black bg-opacity-40 text-zinc-200 p-4">
              <div className="flex justify-between items-center w-full h-10 absolute bottom-5 left-0 px-4">
                <h1 className="text-2xl font-semibold">
                  {currentListItem?.title}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <div>{currentListItem?.description}</div>
                <button
                  onClick={handleEditCoverImage}
                  className="h-12 w-12 bg-[#00000030] hover:bg-[#00000060] transition-colors flex justify-center items-center rounded-full text-xl"
                >
                  <BiSolidPencil />
                </button>
              </div>
            </div>
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
    <div className="md:h-[calc(100vh-5rem)] lg:px-0 px-4 h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
      <div className="lg:h-2"></div>
      <div className="h-96 w-full py-2">
        <div
          className="group h-3/6 w-full relative overflow-hidden rounded-t-md"
          style={coverImageStyle}
        >
          <div className="h-full w-full bg-black bg-opacity-40 text-zinc-200 p-4">
            <div className="flex justify-end items-center">
              <button
                onClick={handleEditCoverImage}
                className="h-12 w-12 opacity-0 group-hover:opacity-100 bg-[#00000030] hover:bg-[#00000060] transition-all flex justify-center items-center rounded-full text-xl"
              >
                <BiSolidPencil />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-3/6 rounded-b-md dark:text-zinc-300 p-4 dark:bg-neutral-800">
          <div className="h-20 flex flex-col justify-start">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-semibold">
                {currentListItem?.title}
              </h1>
              <ListActionButtons listTitle={currentListItem?.title} />
            </div>
            <div className="text-xs space-x-2">
              <span>@{currentListItem?.createdBy?.username}</span>
              <span>
                {currentListItem?.createdAt &&
                  convertMongoDBDate(currentListItem?.createdAt)}
              </span>
            </div>
          </div>
          <div className="pt-4">
            <p>{currentListItem?.description}</p>
          </div>
        </div>
      </div>
      <div className={`grid grid-cols-1 gap-2 ${location.includes("/doc") ? "" : "lg:grid-cols-2"}`}>
        {docs?.map((doc) => (
          <DocCard
            key={doc._id}
            id={doc._id}
            title={doc.title}
            color={theme == "black" ? "bg-black" : currentCardColor}
            link={doc.link}
            currentListId={currentListItem?._id}
            toggleModal={toggleModal}
          />
        ))}
      </div>
      <div className="lg:h-2 h-16"></div>
    </div>
  );
};

export default Docs;
