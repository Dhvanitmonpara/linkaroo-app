import { MdModeEdit } from "react-icons/md";
import AvatarGroup from "./ui/avatarGroup";
import Tag from "./Tag";
import { colorOptions } from "@/lib/types.ts";
import { useNavigate } from "react-router-dom";

type ListCardProps = {
  tagname: string;
  description: string;
  title: string;
  isBlackMode?: boolean;
  color: colorOptions;
  setIsModalOpen: (isOpen: boolean) => void;
};

const imgArray = [
  "https://randomwordgenerator.com/img/picture-generator/57e8d1434857aa14f1dc8460962e33791c3ad6e04e507440752f73dd9544c5_640.jpg",
  "https://www.shutterstock.com/image-photo/very-random-pose-asian-men-260nw-2423213779.jpg",
  "https://i.pinimg.com/236x/eb/09/69/eb096917cedb8fd3b3363d3dec531baa.jpg",
];

const ListCard = ({
  tagname,
  description,
  title,
  isBlackMode = false,
  color,
  setIsModalOpen,
}: ListCardProps) => {
  const navigate = useNavigate();

  const openModal = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setIsModalOpen(true);
    e.stopPropagation();
    navigate(`/list?listid=${title}`, { replace: true });
    // TODO: open modal with content from props (add e.target.dataset.content into state)
  };
  return (
    <>
      <div
        className={`group select-none transition-all h-64 w-full p-6 rounded-md flex justify-between flex-col ${isBlackMode ? "" : color} ${
          isBlackMode
            ? "!text-zinc-300 border-zinc-500 !bg-zinc-900 border-[1px]"
            : "text-black"
        }`}
      >
        <div className="space-y-3 relative">
          <div>
            <p
              className={`${
                isBlackMode ? "text-zinc-300" : "text-slate-800"
              } font-semibold w-fit text-sm pb-3 hover:underline`}
            >
              @dhvanitmonpara
            </p>
            <span
              onClick={(e) => {
                openModal(e);
              }}
              className="group-hover:opacity-100 transition-all ease-in-out duration-300 absolute right-3 opacity-0 active:scale-95 hover:bg-[#00000015] text-lg cursor-pointer p-3 rounded-full"
            >
              <MdModeEdit />
            </span>
            <h1 className="text-2xl py-1 font-mono font-bold hover:underline">
              {title}
            </h1>
          </div>
          <p className="text-sm font-semibold">{description}</p>
        </div>
        <div className="flex space-x-2 overflow-x-scroll">
          <AvatarGroup width="w-7" height="h-7" imgSrcArray={imgArray} />
          {isBlackMode ? (
            <div className={`w-7 h-7 ${color} rounded-full`}></div>
          ) : (
            ""
          )}
          {/* TODO: map tags */}
          <Tag
            isBlackEnable={isBlackMode}
            text={tagname}
          />
          <Tag
            isBlackEnable={isBlackMode}
            text={tagname}
          />
        </div>
      </div>
    </>
  );
};

export default ListCard;
