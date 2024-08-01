import { Tag } from "@/components/index";
import { MdModeEdit } from "react-icons/md";

type colorOptions =
  | "bg-emerald-400"
  | "bg-orange-600"
  | "bg-red-400"
  | "bg-purple-400"
  | "bg-pink-400"
  | "bg-indigo-400"
  | "bg-teal-400"
  | "bg-cyan-400"
  | "bg-amber-400"
  | "bg-violet-400"
  | "bg-yellow-400"
  | "bg-green-400"
  | "bg-blue-400"
  | "bg-rose-400"
  | "bg-sky-400";

type ListCardProps = {
  tagname: string;
  description: string;
  title: string;
  color: colorOptions;
};

const ListCard = ({ tagname, description, title, color }: ListCardProps) => {
  return (
    <div
      className={`h-52 w-full p-6 rounded-lg flex justify-between flex-col ${color} bg-`}
    >
      <div className="space-y-4 relative">
        <div>
          <span className="absolute right-3 text-lg hover:bg-[#00000015] cursor-pointer p-1.5 rounded-full">
            <MdModeEdit />
          </span>
          <h1 className="text-2xl font-mono font-bold">{title}</h1>
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
