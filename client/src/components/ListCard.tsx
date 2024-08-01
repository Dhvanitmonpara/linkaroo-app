import { Tag } from "@/components/index";
import { MdModeEdit } from "react-icons/md";

const ListCard: React.FC<{
  tagname: string;
  description: string;
  title: string;
  color: string;
}> = ({ tagname, description, title, color }) => {
    let bgColor = "";
    if (color === "green") bgColor = `bg-green-400`;
    if (color === "violet") bgColor = `bg-violet-400`;
    if (color === "yellow") bgColor = `bg-yellow-400`;
    if (color === "orange") bgColor = `bg-orange-400`;
    if (color === "red") bgColor = `bg-red-400`;
    if (color === "blue") bgColor = `bg-blue-400`;
    if (color === "purple") bgColor = `bg-purple-400`;
    if (color === "pink") bgColor = `bg-pink-400`;
    if (color === "amber") bgColor = `bg-amber-400`;
    if (color === "gray") bgColor = `bg-gray-400`;

  return (
    <div
      className={`h-52 w-full p-6 rounded-lg flex justify-between flex-col ${bgColor}`}
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
