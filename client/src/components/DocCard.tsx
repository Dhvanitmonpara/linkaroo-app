import { colorOptions } from "@/lib/types.tsx";
import { IoIosArrowForward } from "react-icons/io";

type DocCardProps = {
  title: string;
  text: string;
  color: colorOptions;
};

const DocCard = ({ title, text, color }: DocCardProps) => {
  return (
    <div
      className={`${color} group p-5 h-44 space-y-5 flex-col transition-all rounded-md flex justify-start items-center`}
    >
      <h2 className="font-semibold group-hover:underline decoration-2 cursor-pointer font-mono text-xl flex justify-between w-full items-center">
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
