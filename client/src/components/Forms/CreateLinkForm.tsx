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
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useLinkStore from "@/store/linkStore";
import useCollectionsStore from "@/store/collectionStore";

type CreateLinkFormProps = {
  collectionTitle?: string;
  afterSubmit?: () => void
};

type HandleLinkCreationType = {
  title: string;
  description: string;
  link: string;
  collection: string;
};

const isValidUrl = (url: string): string | null => {
  const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;

  // Determine the protocol
  if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`; // Default to 'https://'
  }

  // Check if the updated URL matches the regex
  if (urlRegex.test(url)) {
      return url; // Return the valid URL
  }

  return null; // Return null if the URL is invalid
};

const CreateLinkForm: React.FC<CreateLinkFormProps> = ({
  collectionTitle,
  afterSubmit
}) => {
  const [loading, setLoading] = useState(false);
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

      const validUrl = isValidUrl(data.link);

      if (!validUrl) {
        toast.error("Invalid URL");
        return;
      }

      const newData = {
        title: data.title,
        description: data.description,
        link: validUrl,
      };

      const link = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/links/${parentList._id}`,
        newData,
        { withCredentials: true }
      );

      if (!link.data.data) {
        toast.error("Failed to add link");
        return
      }

      if (data.collection == links[0].collectionId) {
        addLinkItem(link.data.data);
      }
      console.log(link)
      addCachedLinkItem(data.collection, link.data.data);
 
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      } else {
        console.error(error);
        toast.error("Error while creating link")
      }
    } finally {
      setLoading(false);
      navigate(`/collections/${data.collection}`);
      afterSubmit && afterSubmit()
    }
  };

  return (
    <div className="dark:text-white flex flex-col w-full sm:max-w-96 justify-center items-center space-y-3">
      <form
        className="h-4/5 flex flex-col space-y-4 w-full justify-center items-center"
        onSubmit={handleSubmit(handleLinkCreation)}
      >
        <Input
          id="title"
          type="text"
          autoComplete="off"
          placeholder="Enter title"
          {...register("title", { required: "Title is required" })}
        />
        <Input
          id="link"
          type="text"
          autoComplete="off"
          placeholder="Enter link"
          {...register("link", {
            required: "link is required",
          })}
        />
        <Textarea
          id="description"
          autoComplete="off"
          placeholder="Enter description"
          {...register("description", {
            required: "Description is required",
          })}
        />
        <Controller
          name="collection"
          control={control}
          rules={{ required: "Please select a list" }}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="text-zinc-100 bg-zinc-800 border-zinc-800 sm:max-w-96">
                <SelectValue placeholder="Select list" />
              </SelectTrigger>
              <SelectContent
                className="dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
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
            Add Link
          </Button>
        )}
      </form>
    </div>
  );
};

export default CreateLinkForm;