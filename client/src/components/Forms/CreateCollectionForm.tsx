import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { colorOptions, themeType } from "@/lib/types";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { backgroundImageUrls, themeOptionsArray } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import useDocStore from "@/store/linkStore";
import useCollectionsStore from "@/store/collectionStore";

type CreateCollectionFormProps = {
  theme: themeType | undefined;
};

type HandleCollectionCreationType = {
  title: string;
  description: string;
  theme: colorOptions;
};

const CreateCollectionForm: React.FC<CreateCollectionFormProps> = ({
  theme,
}) => {
  const [loading, setLoading] = useState(false);
  const { addCollectionsItem } = useCollectionsStore();
  const navigate = useNavigate()
  const { setCurrentCollectionItem } = useDocStore()

  const { control, handleSubmit, register } = useForm<HandleCollectionCreationType>({
    defaultValues: {
      theme: "bg-zinc-200",
    },
  });

  const handleCollectionCreation = async (data: HandleCollectionCreationType) => {
    try {
      setLoading(true);

      const randomIndex = Math.floor(
        Math.random() * backgroundImageUrls.length
      );

      const newData = { ...data, coverImage: backgroundImageUrls[randomIndex] };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/collections`,
        newData,
        { withCredentials: true }
      );

      if (response.status !== 200) {
        toast.error("Failed to create collection");
      }

      const collectionId = response.data.data._id;

      if (!collectionId) {
        toast.error("Failed to create collection");
        return;
      }

      const collection = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/collections/u/${collectionId}`,
        { withCredentials: true }
      );

      if (!collection) {
        toast.error("Failed to fetch collection details");
        return;
      }


      addCollectionsItem(collection.data.data);
      setCurrentCollectionItem(collection.data.data);
      navigate(`/collections/${collection.data.data._id}`);
    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:text-white flex flex-col sm:w-96 justify-center items-center space-y-3">
      <form
        className="h-4/5 flex flex-col space-y-4 sm:w-96 w-72 justify-center items-center"
        onSubmit={handleSubmit(handleCollectionCreation)}
      >

        <Input
          id="title"
          type="text"
          placeholder="Enter title"
          {...register("title", { required: "Title is required" })}
        />
        <Textarea
          id="description"
          placeholder="Enter description"
          {...register("description", {
            required: "Description is required",
          })}
        />
        <Controller
          name="theme"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="text-zinc-100 bg-zinc-800 border-zinc-800 max-w-96">
                <SelectValue placeholder="Change theme" />
              </SelectTrigger>
              <SelectContent
                className={cn(
                  theme !== "light"
                    ? "!bg-zinc-900 !text-white border-zinc-800"
                    : "",
                  "[&_[role=option]]:p-0"
                )}
              >
                <SelectGroup>
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {themeOptionsArray.map((themeOption) => (
                      <SelectItem
                        key={themeOption.value}
                        value={themeOption.value}
                        className={cn(
                          themeOption.value,
                          "text-transparent p-4 h-16 text-center flex justify-center items-center rounded border border-none hover:text-black dark:hover:text-black active:text-black focus:outline-none",
                          "data-[state=checked]:font-semibold data-[state=checked]:!text-zinc-900",
                          "[&>span>span]:hidden",
                          `focus:${themeOption.value} focus:brightness-110 transition-colors duration-75`
                        )}
                      >
                        {themeOption.label}
                      </SelectItem>
                    ))}
                  </div>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />

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
            Create Collection
          </Button>
        )}
      </form>
    </div>
  );
};

export default CreateCollectionForm;
