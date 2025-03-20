import { fetchedLinkType } from "@/lib/types";
import useLinkStore from "@/store/linkStore";
import useMethodStore from "@/store/MethodStore";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const LinkModal = () => {
  const [loading, setLoading] = useState(true);
  const { links } = useLinkStore();
  const [currentCard, setCurrentCard] = useState<fetchedLinkType | null>(null);
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const { currentCardColor } = useMethodStore();

  const cardId = location.split("/").slice(-1)[0];
  useEffect(() => {
    try {
      setLoading(true);
      const card = links.filter((card) => card._id == cardId)[0];

      setCurrentCard(card);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      } else {
        console.error(error);
        toast.error("Error while fetching link data")
      }
    } finally {
      setLoading(false);
    }
  }, [cardId, links, location, navigate]);

  if (loading) return <div>Loading</div>;

  return (
    <div
      className={`h-full w-full relative dark:bg-zinc-900 dark:text-zinc-200 flex flex-col p-5 select-none`}
    >
      <div
        className={`${currentCardColor} text-zinc-900 h-1.5 w-full absolute top-0 left-0`}
      ></div>
      <h1 className="text-4xl font-semibold pt-3">{currentCard?.title}</h1>
      <span
        onClick={() => {
          window.open(currentCard?.link, "_blank");
        }}
        className={`pt-3 hover:text-black dark:hover:text-white ${currentCardColor == "bg-black" ? "dark:hover:text-white" : ""
          } cursor-pointer hover:underline`}
      >
        {currentCard?.link}
      </span>
      <p className="pt-5">{currentCard?.description}</p>
    </div>
  );
};

export default LinkModal;