import { Tag } from "@/components/index";
import { MdModeEdit } from "react-icons/md";
import { colorOptions } from "@/lib/types.ts";

type ListCardProps = {
  tagname: string;
  description: string;
  title: string;
  color: colorOptions;
};

const ListCard = ({ tagname, description, title, color }: ListCardProps) => {
  return (
    <div
      className={`group transition-all h-64 w-full p-6 rounded-md flex justify-between flex-col ${color} bg-`}
    >
      <div className="space-y-3 relative">
        <div>
          <span className="group-hover:opacity-100 transition-all ease-in-out duration-300 absolute right-3 opacity-0 active:scale-95 hover:bg-[#00000015] text-lg cursor-pointer p-3 rounded-full">
            <MdModeEdit />
          </span>
          <h1 className="text-2xl py-1 font-mono font-bold">{title}</h1>
        </div>
        <p className="text-sm font-semibold">{description}</p>
      </div>
      <div className="flex space-x-2">
        {/* TODO: map tags */}
        <Tag text={tagname} />
        <Tag text={tagname} />
        <Tag text={tagname} />
        <Tag text={tagname} />
      </div>
    </div>
  );
};

export default ListCard;
