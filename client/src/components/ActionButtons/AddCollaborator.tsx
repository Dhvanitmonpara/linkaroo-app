import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdPersonAdd } from "react-icons/io";

import useProfileStore from "@/store/profileStore";
import { cn } from "@/lib/utils";
import AddCollaboratorForm from "../Forms/AddCollaboratorForm";
import DrawerMenu from "../DrawerMenu";
const AddCollaborator: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [confirmRequest, setConfirmRequest] = useState(false);

  const { profile } = useProfileStore();
  const theme = profile.theme;

  return (
    <>
      <DropdownMenu
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setConfirmRequest(false);
          setValue("");
        }}
        modal={false}
      >
        <DropdownMenuTrigger className="hidden md:flex" asChild>
          <div className="h-full w-full flex justify-center items-center cursor-pointer">
            <IoMdPersonAdd />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            "w-[200px] p-0",
            theme !== "light" && "bg-zinc-900 text-zinc-200 border-zinc-700"
          )}
        >
          <AddCollaboratorForm
            confirmRequest={confirmRequest}
            setConfirmRequest={setConfirmRequest}
            value={value}
            setOpen={setOpen}
            setValue={setValue}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <DrawerMenu triggerClassNames="md:hidden" trigger={<div
        className="space-x-2 w-full md:space-x-0 bg-transparent hover:bg-transparent border-none flex items-center rounded-full text-xl"
        aria-label="Tag Options"
      >
        <span className="flex md:hidden justify-center items-center h-12 w-12">
          <IoMdPersonAdd />
        </span>
        <span className="text-lg">Add Collaborators</span>
      </div>}>
        <div className="px-4 flex flex-col gap-2">
          <AddCollaboratorForm
            confirmRequest={confirmRequest}
            setConfirmRequest={setConfirmRequest}
            value={value}
            setOpen={setOpen}
            setValue={setValue}
          />
        </div>
      </DrawerMenu>
    </>
  );
};

export default AddCollaborator;
