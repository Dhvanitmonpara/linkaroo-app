import { ListCard } from "@/components";
import { themeType, fetchedListType } from "@/lib/types";
import getErrorFromAxios from "@/utils/getErrorFromAxios";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";

type ListsProps = {
  theme: themeType | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
};

const Lists = ({ theme, setIsModalOpen }: ListsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [totalLists, setTotalLists] = useState<fetchedListType[] | []>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(undefined);

        // const ownerResponseData: AxiosResponse = await axios({
        //   method: "GET",
        //   url: `${import.meta.env.VITE_SERVER_API_URL}/lists/o`,
        //   withCredentials: true,
        // });

        // if (!ownerResponseData) {
        //   setError("Failed to fetch user's lists.");
        //   return;
        // }

        // const ownerData: fetchedListType[] = ownerResponseData.data.data;

        // const collaboratorResponseData: AxiosResponse = await axios({
        //   method: "GET",
        //   url: `${import.meta.env.VITE_SERVER_API_URL}/lists/c`,
        //   withCredentials: true,
        // });

        // if (!collaboratorResponseData) {
        //   setError("Failed to fetch collaborator's lists.");
        //   return;
        // }

        // const collaboratorData: fetchedListType[] =
        //   collaboratorResponseData.data.data;

        // console.log("ownerData:", collaboratorResponseData.data.data);
        // console.log("collaboratorData:", collaboratorResponseData.data.data);

        // setTotalLists([...ownerData, ...collaboratorData]);

        const response: AxiosResponse = await axios({
          method: "GET",
          url: `${import.meta.env.VITE_SERVER_API_URL}/lists/u`,
          withCredentials: true,
        });

        if (!response) {
          setError("Failed to fetch user's lists.");
          return;
        }
        console.log(response);
        const listData: fetchedListType[] = response.data.data;

        setTotalLists(listData);

        setLoading(false);
      } catch (error) {
        const errorMsg = getErrorFromAxios(error as AxiosError);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  console.log(error, loading);

  return (
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
  );
};

export default Lists;
