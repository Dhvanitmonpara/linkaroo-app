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
  SelectLabel,
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

type CreateDocFormProps = {
  theme: themeType | undefined;
  toggleModal: (isOpen: boolean) => void;
  listTitle?: string;
};

type HandleDocCreationType = {
  title: string;
  description: string;
  link: string;
  list: string;
};

const CreateDocForm: React.FC<CreateDocFormProps> = ({
  theme,
  toggleModal,
  listTitle,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { collections } = useCollectionsStore();
  const { addLinkItem, links, addCachedLinkItem } = useLinkStore();

  const { control, handleSubmit, register } = useForm<HandleDocCreationType>({
    defaultValues: {
      list: listTitle
        ? collections.find((collection) => collection.title === listTitle)?._id
        : "",
    },
  });

  const handleDocCreation = async (data: HandleDocCreationType) => {
    try {
      setLoading(true);

      const parentList = collections.find((list) => list._id === data.list);

      if (!data.list || !parentList) {
        toast.error("Invalid list");
        return;
      }

      const newData = {
        title: data.title,
        description: data.description,
        link: data.link,
      };

      const doc = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/cards/${data.list}`,
        newData,
        { withCredentials: true }
      );

      if (!doc.data.data) {
        toast.error("Failed to create doc");
      }

      if (data.list == links[0].listId) {
        addLinkItem(doc.data.data);
      }

      addCachedLinkItem(data.list, doc.data.data);

    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      setLoading(false);
      toggleModal(false);
      navigate(`/lists/${data.list}`);
    }
  };

  return (
    <div className="dark:text-white p-5 flex flex-col justify-center items-center space-y-3">
      <h1 className="text-3xl">Create a new Doc</h1>
      <form
        className="h-4/5 flex flex-col space-y-6 sm:w-96 w-72 justify-center items-center"
        onSubmit={handleSubmit(handleDocCreation)}
      >
        <div className="w-full space-y-2">
          <label htmlFor="title">Title</label>
          <Input
            id="title"
            type="text"
            placeholder="Enter title"
            className="dark:bg-zinc-700 bg-zinc-200"
            {...register("title", { required: "Title is required" })}
          />
        </div>
        <div className="w-full space-y-2">
          <label htmlFor="description">Link</label>
          <Input
            id="link"
            type="text"
            placeholder="Enter link"
            className="dark:bg-zinc-700 bg-zinc-200"
            {...register("link", {
              required: "link is required",
            })}
          />
        </div>
        <div className="w-full space-y-2">
          <label htmlFor="description">Description</label>
          <Textarea
            id="description"
            placeholder="Enter description"
            className="dark:bg-zinc-700 bg-zinc-200"
            {...register("description", {
              required: "Description is required",
            })}
          />
        </div>
        <div className="w-full space-y-2">
          <span>List</span>
          <Controller
            name="list"
            control={control}
            rules={{ required: "Please select a list" }}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="dark:text-white dark:bg-zinc-700 max-w-96">
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
                    <SelectLabel>Lists</SelectLabel>
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
        </div>
        
        {loading ? (
          <Button
            disabled
            className="dark:bg-zinc-700 dark:hover:bg-zinc-600 hover:bg-zinc-300 text-zinc-900 bg-zinc-200 w-full dark:text-white cursor-wait"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin dark:text-white" />
            Please wait
          </Button>
        ) : (
          <Button className="dark:bg-zinc-700 bg-zinc-200 font-semibold text-zinc-950 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 w-full">
            Create Doc
          </Button>
        )}
      </form>
    </div>
  );
};

export default CreateDocForm;