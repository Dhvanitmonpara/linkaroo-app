import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { themeType } from "@/lib/types";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import useLinkStore from "@/store/linkStore";
import useCollectionsStore from "@/store/collectionStore";

type CreateLinkBarProps = {
  theme: themeType | undefined;
  collectionTitle?: string;
};

type HandleLinkCreationType = {
  title: string;
  description: string;
  link: string;
  collection: string;
};

const CreateLinkBar: React.FC<CreateLinkBarProps> = ({
  theme,
  collectionTitle,
}) => {
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("")
  const [isDescriptionActive, setIsDescriptionActive] = useState(false)

  const navigate = useNavigate();

  const { collections } = useCollectionsStore();
  const { addLinkItem, links, addCachedLinkItem } = useLinkStore();

  const { control, handleSubmit, register } = useForm<HandleLinkCreationType>({
    defaultValues: {
      collection: collectionTitle
        ? collections.find((collection) => collection.title === collectionTitle)?._id
        : "",
    },
  });

  const handleLinkCreation = async (data: HandleLinkCreationType) => {
    try {
      setLoading(true);

      const parentList = collections.find((list) => list._id === data.collection);

      if (!data.collection || !parentList) {
        toast.error("Invalid list");
        return;
      }

      const newData = {
        title: data.title,
        description: data.description,
        link: data.link,
      };

      const link = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/cards/${data.collection}`,
        newData,
        { withCredentials: true }
      );

      if (!link.data.data) {
        toast.error("Failed to add link");
      }

      if (data.collection == links[0].collectionId) {
        addLinkItem(link.data.data);
      }

      addCachedLinkItem(data.collection, link.data.data);

    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      setLoading(false);
      navigate(`/collections/${data.collection}`);
    }
  };

  return (
    <div className="dark:text-white flex flex-col w-full justify-center items-center space-y-3">
      <form
        className="flex flex-col w-full justify-center items-center bg-zinc-800/70 rounded-3xl"
        onSubmit={handleSubmit(handleLinkCreation)}
      >
        <div className="flex w-full relative border-zinc-800/80 border-1 rounded-3xl">
          <Input
            id="identifier"
            type="text"
            autoFocus
            onChange={(e) => setIdentifier(e.target.value)}
            value={identifier}
            placeholder="Enter a title or link"
            className="rounded-3xl py-4 px-6 text-base"
          />
          <div className="absolute top-1 right-1">
            {loading ? (
              <Button
                disabled
                className="dark:bg-zinc-700 h-8 rounded-full dark:hover:bg-zinc-600 hover:bg-zinc-300/70 text-zinc-900 bg-zinc-200 w-full dark:text-white cursor-wait"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin dark:text-white" />
                Please wait
              </Button>
            ) : (
              <Button className={`dark:bg-zinc-700 h-8 rounded-full bg-zinc-200 font-semibold text-zinc-950 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 w-full transition-all duration-300 ${identifier ? "scale-100" : "scale-0"}`}>
                Add
              </Button>
            )}
          </div>
        </div>
        <div className="flex space-x-2 py-2 w-full px-6">
          <Controller
            name="collection"
            control={control}
            rules={{ required: "Please select a list" }}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="text-zinc-300 !bg-zinc-800/70 hover:bg-zinc-700/70 max-w-24 py-0.5 px-2.5 h-fit border-0">
                  <SelectValue placeholder="Select list" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme !== "light"
                      ? "!bg-zinc-900 !text-white border-zinc-800"
                      : ""
                  }
                >
                  <SelectGroup>
                    {collections.map((list) => (
                      <SelectItem key={list._id} value={list._id}>
                        {list.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <button
            onClick={() => setIsDescriptionActive(!isDescriptionActive)}
            className="text-zinc-300 bg-zinc-800/70 hover:bg-zinc-700/70 text-xs py-0.5 px-2.5 rounded-md"
          >
            {isDescriptionActive ? "Remove" : "Add"} Description
          </button>
        </div>
        <div className={`px-6 w-full transition-all duration-300 overflow-hidden ${isDescriptionActive ? "pb-2" : "h-0"}`}>
          <Textarea
            id="description"
            placeholder="Enter description"
            {...register("description", {
              required: "Description is required",
            })}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateLinkBar;