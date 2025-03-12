import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Import Check icon
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { colorOptions } from "@/lib/types";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import useMethodStore from "@/store/MethodStore";
import "./style/EditListForm.css";
import { cn } from "@/lib/utils";
import { themeOptionsArray } from "@/lib/constants";
import useLinkStore from "@/store/linkStore";
import useCollectionsStore from "@/store/collectionStore";

type HandleListEditType = {
  title: string;
  description: string;
  theme: colorOptions;
};

const EditListForm = () => {

  const [loading, setLoading] = useState(false);
  const { updateCollectionsItem } = useCollectionsStore();
  const { currentCollectionItem, setCurrentCollectionItem } = useLinkStore();
  // const [icon, setIcon] = useState(currentCollectionItem?.icon || "");
  const { setCurrentCardColor } = useMethodStore();

  const { control, handleSubmit, register } = useForm<HandleListEditType>({
    defaultValues: {
      theme: currentCollectionItem?.theme,
      title: currentCollectionItem?.title,
      description: currentCollectionItem?.description,
    },
  });

  const handleListCreation = async (data: HandleListEditType) => {
    try {
      setLoading(true);

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_API_URL}/lists/o/${currentCollectionItem?._id
        }`,
        data,
        { withCredentials: true }
      );

      if (response.status !== 200) {
        toast.error("Failed to update list");
        return;
      }

      const collectionId = response.data.data._id;

      if (!collectionId) {
        toast.error("Failed to update list");
        return;
      }

      const list = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/lists/u/${collectionId}`,
        { withCredentials: true }
      );

      if (!list) {
        toast.error("Failed to fetch list details");
        return;
      }

      updateCollectionsItem(list.data.data);
      setCurrentCollectionItem(list.data.data);
      setCurrentCardColor(list.data.data.theme);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      } else {
        console.error(error);
        toast.error("Error while updating list")
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:text-white flex flex-col sm:w-full sm:max-w-96 justify-center items-center space-y-3">
      <form
        className="h-4/5 flex flex-col space-y-4 w-full justify-center items-center"
        onSubmit={handleSubmit(handleListCreation)}
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
        <div className="flex justify-center items-center w-full space-x-2">
          <Controller
            name="theme"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="text-white bg-zinc-800 w-full border-zinc-800 sm:max-w-96">
                  <SelectValue placeholder="Change theme" />
                </SelectTrigger>
                <SelectContent
                  className={cn("!bg-zinc-900 !text-white border-zinc-800 [&_[role=option]]:p-0"
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
        </div>

        {loading ? (
          <Button
            disabled
            className="dark:bg-zinc-300 bg-zinc-900 dark:text-zinc-950 text-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-400/90 font-semibold w-full cursor-wait"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin dark:text-white" />
            Please wait
          </Button>
        ) : (
          <Button className="dark:bg-zinc-300 bg-zinc-900 dark:text-zinc-950 text-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-400/90 font-semibold w-full">
            Save changes
          </Button>
        )}
      </form >
    </div>
  );
};

export default EditListForm;