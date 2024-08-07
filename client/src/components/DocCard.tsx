import { colorOptions } from "@/lib/types.tsx";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

type DocCardProps = {
  title: string;
  text: string;
  color: colorOptions;
  setIsModalOpen: (isOpen: boolean) => void;
};

const DocCard = ({ title, text, color, setIsModalOpen }: DocCardProps) => {
  const navigate = useNavigate();

  const openModal = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setIsModalOpen(true);
    e.stopPropagation();
    navigate(`/doc?docid=${title}`, { replace: true });
    // TODO: open modal with content from props (add e.target.dataset.content into state)
  };
  return (
    <div
      className={`${color} ${color == "bg-black" ? "!text-white border-zinc-500 border-[1px]" : "text-black"} select-none group p-5 h-44 space-y-5 flex-col transition-all rounded-md flex justify-start items-center`}
    >
      <h2
        onClick={(e) => {
          openModal(e);
        }}
        className="font-semibold group-hover:underline decoration-2 cursor-pointer font-mono text-xl flex justify-between w-full items-center"
      >
        {title}
        <span className="opacity-0 hover:bg-[#00000020] active:scale-95 rounded-full p-2 group-hover:opacity-100 transition-all ease-in-out duration-300">
          <IoIosArrowForward />
        </span>
      </h2>
      <p className="cursor-default">{text}</p>
    </div>
  );
};

export default DocCard;
