import { DocCard } from "@/components";
import { fetchedListType } from "@/lib/types";
import useListStore from "@/store/listStore";
import useMethodStore from "@/store/MethodStore";
import useProfileStore from "@/store/profileStore";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const InboxPage = () => {
  const profile = useProfileStore().profile;
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const { inbox, setInboxDocs, inboxDocs, setLists, setInbox, lists } = useListStore();
  const { toggleModal } = useMethodStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (location.includes("/inbox") && inboxDocs.length == 0) {
        try {
          setLoading(true);

          const inboxId = inbox?._id;
          
          if (!inboxId) {
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
                  const inboxList = allLists.find(
                    (list: fetchedListType) => list.isInbox === true
                  );
                  const regularLists = allLists.filter(
                    (list: fetchedListType) => list.isInbox === false
                  );

                  setLists(regularLists);
                  setInbox(inboxList);
                }
              } catch (error) {
                handleAxiosError(error as AxiosError, navigate);
              } finally {
                setLoading(false);
              }
            }
          } else {
            const response: AxiosResponse = await axios.get(
              `${import.meta.env.VITE_SERVER_API_URL}/cards/${inboxId}`,
              { withCredentials: true }
            );

            if (!response.data.data) {
              toast.error("Failed to fetch list details");
              return;
            }
            setInboxDocs(response.data.data);
          }
        } catch (error) {
          handleAxiosError(error as AxiosError, navigate);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [setInboxDocs, location, inbox?._id, navigate]);

  if (loading) {
    return (
      <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-8rem)] lg:h-[calc(100vh-4.5rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
        <div className="dark:text-white h-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        profile.theme !== "light" ? "text-zinc-100" : "text-zinc-900"
      } no-scrollbar select-none h-[calc(100vh-4.5rem)] overflow-y-scroll `}
    >
      <div className="flex justify-center items-center flex-col space-y-12 pt-36">
        <div className="flex justify-center items-center flex-col space-y-3">
          <h1 className="text-5xl font-semibold">Inbox</h1>
          <p
            className={`mt-4 text-lg ${
              profile.theme !== "light" ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Ready to capture your links?
          </p>
        </div>
      </div>
      <div className="px-4 md:px-24 xl:px-56 2xl-px-64 py-8 pt-24 grid sm:grid-cols-2 gap-2">
        {inboxDocs?.length > 0 &&
          inboxDocs.map((doc) => (
            <DocCard
              key={doc._id}
              id={doc._id}
              title={doc.title}
              color="bg-black"
              link={doc.link}
              isChecked={doc.isChecked}
              currentListId={inbox?._id}
              toggleModal={toggleModal}
            />
          ))}
      </div>
      <div className="lg:h-2 h-16"></div>
    </div>
  );
};

export default InboxPage;
