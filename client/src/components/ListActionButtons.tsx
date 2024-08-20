import { MdModeEditOutline } from "react-icons/md";
import { FaTag } from "react-icons/fa6";
import useMethodStore from "@/store/MethodStore";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import useProfileStore from "@/store/profileStore";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const ListActionButtons = () => {
  const { toggleModal, setModalContent } = useMethodStore();
  const { profile } = useProfileStore();
  const theme = profile.profile.theme;
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
  const [showPanel, setShowPanel] = useState<Checked>(false);

  const handleEditList = () => {
    toggleModal(true);
    setModalContent(<h1>helo</h1>);
  };

  const icons = [
    {
      element: <MdModeEditOutline />,
      action: handleEditList,
    },
    {
      element: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-transparent hover:bg-transparent hover:text-black border-none"
            >
              <FaTag />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`w-56
              ${
                theme !== "light" ? "!bg-black !text-white border-zinc-800" : ""
              }
            `}
          >
            <DropdownMenuLabel>Tags</DropdownMenuLabel>
            <DropdownMenuSeparator className={theme !== "light" ? "bg-zinc-800" : ""}/>
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showActivityBar}
              onCheckedChange={setShowActivityBar}
            >
              Activity Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              Panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <div className="flex justify-center items-center space-x-3">
      {icons?.map((icon, index) => (
        <button
          key={index}
          onClick={icon?.action ? icon.action : () => null}
          className="h-12 w-12 bg-[#00000010] hover:bg-[#00000025] transition-colors flex justify-center items-center rounded-full text-xl"
        >
          {icon.element}
        </button>
      ))}
    </div>
  );
};

export default ListActionButtons;
