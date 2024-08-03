import { MdModeEdit } from "react-icons/md";
import AvatarGroup from "./ui/avatarGroup";
import Tag from "./Tag";
import { colorOptions } from "@/lib/types.ts";

type ListCardProps = {
  tagname: string;
  description: string;
  title: string;
  color: colorOptions;
  setIsModalOpen: (isOpen: boolean) => void;
};

const imgArray = [
  "https://randomwordgenerator.com/img/picture-generator/57e8d1434857aa14f1dc8460962e33791c3ad6e04e507440752f73dd9544c5_640.jpg",
  "https://www.shutterstock.com/image-photo/very-random-pose-asian-men-260nw-2423213779.jpg",
  "https://i.pinimg.com/236x/eb/09/69/eb096917cedb8fd3b3363d3dec531baa.jpg",
];

const ListCard = ({ tagname, description, title, color, setIsModalOpen }: ListCardProps) => {

  const openModal = (e:React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setIsModalOpen(true);
    e.stopPropagation();
  }

  return (
    <>
      <div
        className={`group transition-all h-64 w-full p-6 rounded-md flex justify-between flex-col ${color} bg-`}
      >
        <div className="space-y-3 relative">
          <div>
            <span onClick={(e)=>{openModal(e)}}
              className="group-hover:opacity-100 transition-all ease-in-out duration-300 absolute right-3 opacity-0 active:scale-95 hover:bg-[#00000015] text-lg cursor-pointer p-3 rounded-full"
            >
              <MdModeEdit />
            </span>
            <h1 className="text-2xl py-1 font-mono font-bold">{title}</h1>
          </div>
          <p className="text-sm font-semibold">{description}</p>
        </div>
        <div className="flex space-x-2">
          <AvatarGroup width="w-7" height="h-7" imgSrcArray={imgArray} />
          {/* TODO: map tags */}
          <Tag text={tagname} />
          <Tag text={tagname} />
          <Tag text={tagname} />
          <Tag text={tagname} />
        </div>
      </div>
    </>
  );
};

export default ListCard;
