import { colorOptions } from "@/lib/types.tsx";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import useMethodStore from "@/store/MethodStore";
import { useMediaQuery } from "react-responsive";

type DocCardProps = {
  title: string;
  color: colorOptions;
  link: string;
  currentListId: string | undefined;
  toggleModal: (isOpen: boolean) => void;
};

const DocCard = ({ title, color, link, currentListId, toggleModal }: DocCardProps) => {
  const navigate = useNavigate();
  const { setModalContent, setPrevPath } = useMethodStore();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });

  const openModal = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    toggleModal(true);
    e.stopPropagation();
    setPrevPath(location.pathname);
    if (location.pathname.includes("/doc")) {
      navigate(`/lists/${currentListId}/doc?docid=${title}`);
    } else {
      navigate(`doc?docid=${title}`);
    }
    setModalContent(<div className="text-5xl text-white">Hello</div>);
  };

  const openLink = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent the modal from opening
    window.open(link, "_blank");
  };

  const cardClass = `${color} ${
    color === "bg-black"
      ? "!text-zinc-300 border-zinc-500 !bg-zinc-900 border-[1px]"
      : "text-black"
  } select-none group px-5 h-14 flex-col transition-all rounded-md flex justify-center items-center`;

  return (
    <div className={cardClass}>
      <h2
        onClick={(e) => {
          if (isSmallScreen) {
            openModal(e);
          } else {
            if (location.pathname.includes("/doc")) {
              navigate(`/lists/${currentListId}/doc?docid=${title}`);
            } else {
              navigate(`doc?docid=${title}`);
            }
          }
        }}
        className={`font-semibold group-hover:underline decoration-2 cursor-pointer text-lg flex justify-between w-full items-center ${""}`}
      >
        <span onClick={openLink}>{title}</span>
        <span
          onClick={openLink}
          className="md:opacity-0 opacity-100 hover:bg-[#00000020] active:scale-95 rounded-full p-2 group-hover:opacity-100 transition-all ease-in-out duration-300"
        >
          <FiArrowUpRight />
        </span>
      </h2>
    </div>
  );
};

export default DocCard;
