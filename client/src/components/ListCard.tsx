import AvatarGroup from "./ui/avatarGroup";
import { colorOptions, TagType, Collaborator, fontOptions } from "@/lib/types.ts";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import Tag from "./Tag";
import { removeUsernameTag } from "@/utils/toggleUsernameInTag";

type ListCardProps = {
  tagname: TagType[];
  description: string;
  title: string;
  isBlackMode?: boolean;
  createdBy: Collaborator;
  theme: colorOptions;
  font: fontOptions;
  collaborators: Collaborator[];
  setIsModalOpen: (isOpen: boolean) => void;
};

const ListCard = ({
  tagname,
  description,
  title,
  isBlackMode = false,
  collaborators,
  theme,
  font,
  createdBy,
  setIsModalOpen,
}: ListCardProps) => {
  const navigate = useNavigate();

  const collaboratorAvatars: string[] = [];

  collaborators?.forEach((collaborator) => {
    collaboratorAvatars.push(collaborator.avatarImage);
  });

  const openModal = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setIsModalOpen(true);
    e.stopPropagation();
    navigate(`/list?listid=${title}`, { replace: true });
    // TODO: open modal with content from props (add e.target.dataset.content into state)
  };

  const tags: string[] = [];

  tagname?.forEach((tag) => {
    const tagname = removeUsernameTag(tag.tagname);
    if (tagname != undefined) {
      tags.push(tagname);
    }
  });

  return (
    <>
      <div
        className={`group select-none transition-all h-64 w-full p-6 rounded-md flex justify-between flex-col ${
          isBlackMode ? "" : theme
        } ${
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
              @{createdBy?.username}
            </p>
            <span
              onClick={(e) => {
                openModal(e);
              }}
              className="group-hover:opacity-100 text-xl transition-all ease-in-out duration-300 absolute right-3 opacity-0 active:scale-95 hover:bg-[#00000015] cursor-pointer p-3 rounded-full"
            >
              <IoMdAdd />
            </span>
            <h1 className={`text-2xl py-1 font-bold hover:underline ${font}`}>
              {title}
            </h1>
          </div>
          <p className="text-sm font-semibold">{description}</p>
        </div>
        <div className="flex space-x-2 overflow-x-scroll">
          <AvatarGroup
            width="w-7"
            height="h-7"
            imgSrcArray={[createdBy?.avatarImage, ...collaboratorAvatars]}
          />
          {isBlackMode ? (
            <div className={`w-7 h-7 ${theme} rounded-full`}></div>
          ) : (
            ""
          )}
          {tags.length > 0 &&
            tags.map((tag, index) => (
              <Tag isBlackEnable={isBlackMode} key={index} text={tag} />
            ))}
        </div>
      </div>
    </>
  );
};

export default ListCard;
