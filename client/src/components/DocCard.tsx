import { colorOptions } from "@/lib/types.tsx";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

type DocCardProps = {
  title: string;
  color: colorOptions;
  link: string;
  toggleModal: (isOpen: boolean) => void;
};

const DocCard = ({ title, color, link, toggleModal }: DocCardProps) => {
  const navigate = useNavigate();

  const openModal = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    toggleModal(true);
    e.stopPropagation();
    navigate(`/doc?docid=${title}`, { replace: true });
    // TODO: open modal with content from props (add e.target.dataset.content into state)
  };

  const openLink = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent the modal from opening
    window.open(link, "_blank");
  };

  const cardClass = `${color} ${
    color === "bg-black"
      ? "!text-zinc-300 border-zinc-500 !bg-zinc-900 border-[1px]"
      : "text-black"
  } select-none group px-5 h-16 flex-col transition-all rounded-md flex justify-center items-center`;

  return (
    <div className={cardClass}>
      <h2
        onClick={openModal}
        className="font-semibold group-hover:underline decoration-2 cursor-pointer font-mono text-xl flex justify-between w-full items-center"
      >
        <span onClick={openLink}>{title}</span>
        <span
          onClick={openLink}
          className="opacity-0 hover:bg-[#00000020] active:scale-95 rounded-full p-2 group-hover:opacity-100 transition-all ease-in-out duration-300"
        >
          <FiArrowUpRight />
        </span>
      </h2>
    </div>
  );
};

export default DocCard;
