import { ListCard } from "@/components";
import { themeType, fetchedListType } from "@/lib/types";
import getErrorFromAxios from "@/utils/getErrorFromAxios";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type ListsProps = {
  theme: themeType | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
};

const Lists = ({ theme, setIsModalOpen }: ListsProps) => {
  const [loading, setLoading] = useState(false);
  const [totalLists, setTotalLists] = useState<fetchedListType[] | []>([]);

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
        const listData: fetchedListType[] = response.data.data;

        setTotalLists(listData);

        setLoading(false);
      } catch (error) {
        const errorMsg = getErrorFromAxios(error as AxiosError);
        if (errorMsg !== undefined) {
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="col-span-2 relative space-y-3 overflow-y-scroll no-scrollbar h-[calc(100vh-5rem)]">
        {totalLists.map((list, index) => (
          <ListCard
            key={index}
            title={list.title}
            description={list.description}
            tagname={list.tags}
            collaborators={list.collaborators}
            createdBy={list.createdBy}
            theme={list.theme}
            isBlackMode={theme == "black" ? true : false}
            setIsModalOpen={setIsModalOpen}
          />
        ))}
        <div className="h-2"></div>
      </div>
      <Toaster />
    </>
  );
};

export default Lists;
