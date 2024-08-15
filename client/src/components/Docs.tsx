import { DocCard } from "@/components";
import { themeType } from "@/lib/types";
import useDocStore from "@/store/docStore";
import useMethodStore from "@/store/MethodStore";
import getErrorFromAxios from "@/utils/getErrorFromAxios";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

type DocsProps = {
  theme: themeType | undefined;
};

const Docs = ({ theme }: DocsProps) => {
  const { toggleModal } = useMethodStore();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { docs, setDocs } = useDocStore();

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
      <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
        <div className="dark:text-white h-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
        ;
      </div>
    );
  }

  if (docs.length == 0) {
    return (
      <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
        <div className="dark:text-zinc-200 h-full flex justify-center items-center flex-col space-y-2">
          <h1 className="text-2xl text-center">
            {docs.length == 0
              ? "No documents available"
              : "This list consists 0 docs"}
          </h1>
          <p>{docs.length == 0 ? "Select docs to see" : "Create some"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:h-[calc(100vh-5rem)] h-[calc(100vh-9rem)] overflow-y-scroll w-full space-y-2 no-scrollbar">
      {docs?.map((doc) => (
        <DocCard
          key={doc._id}
          title={doc.title}
          text={doc.description}
          color={theme == "black" ? "bg-black" : doc.theme}
          link={doc.link}
          setIsModalOpen={toggleModal}
        />
      ))}
      <div className="h-2"></div>
    </div>
  );
};

export default Docs;
