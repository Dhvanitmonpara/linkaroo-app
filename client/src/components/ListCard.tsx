import { Button } from "@/components/ui/button";
import { MdModeEdit } from "react-icons/md";
import AvatarGroup from "./ui/avatarGroup";
import Tag from "./Tag";
import { colorOptions } from "@/lib/types.ts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ListCardProps = {
  tagname: string;
  description: string;
  title: string;
  color: colorOptions;
};

const imgArray = [
  "https://randomwordgenerator.com/img/picture-generator/57e8d1434857aa14f1dc8460962e33791c3ad6e04e507440752f73dd9544c5_640.jpg",
  "https://www.shutterstock.com/image-photo/very-random-pose-asian-men-260nw-2423213779.jpg",
  "https://i.pinimg.com/236x/eb/09/69/eb096917cedb8fd3b3363d3dec531baa.jpg",
];

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ListCard = ({
  tagname,
  description,
  title,
  color,
}: ListCardProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <ListCard
            tagname="Hello"
            title="welcome"
            description="bruhh can you Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, culpa odit? Ipsa corporis consequatur omnis rem fugit odio, temporibus esse."
            color="bg-sky-400"
          /> */}
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
            <AvatarGroup width="w-7" height="h-7" imgSrcArray={imgArray} />
            {/* TODO: map tags */}
            <Tag text={tagname} />
            <Tag text={tagname} />
            <Tag text={tagname} />
            <Tag text={tagname} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ListCard;