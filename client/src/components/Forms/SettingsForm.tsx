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
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { colorOptions, fontOptions, themeType } from "@/lib/types";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import getErrorFromAxios from "@/utils/getErrorFromAxios";
import useProfileStore from "@/store/profileStore";
import toggleThemeModeAtRootElem from "@/utils/toggleThemeMode";

type CreateListFormProps = {
  theme: themeType | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
};

type HandleListCreationType = {
  title: string;
  description: string;
  theme: colorOptions;
  font: fontOptions;
};

const CreateListForm: React.FC<CreateListFormProps> = ({
  theme,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const { changeTheme } = useProfileStore();

  const themeHandler = (theme: themeType) => {
    changeTheme(theme);
    if (theme == "black") {
      toggleThemeModeAtRootElem("dark");
    } else {
      toggleThemeModeAtRootElem(theme);
    }
  };

  const { control, handleSubmit, register } = useForm<HandleListCreationType>({
    defaultValues: {
      theme: "bg-zinc-200",
      font: "font-mono",
    },
  });

  const handleListCreation = async (data: HandleListCreationType) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/lists`,
        data,
        { withCredentials: true }
      );

      if (response.status !== 200) {
        toast.error("Failed to create list");
      }

      const listId = response.data.data._id;

      if (!listId) {
        toast.error("Failed to create list");
        return;
      }

      const list = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}/lists/u/${listId}`,
        { withCredentials: true }
      );

      if (!list) {
        toast.error("Failed to fetch list details");
        return;
      }

      //   addListItem(list.data.data);
    } catch (error) {
      const errorMsg = getErrorFromAxios(error as AxiosError);
      if (errorMsg != undefined) {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="dark:text-white p-5 flex flex-col justify-center items-center space-y-3">
      <h1 className="text-3xl">Add List</h1>
      <form
        className="h-4/5 flex flex-col space-y-6 sm:w-96 w-72 justify-center items-center"
        onSubmit={handleSubmit(handleListCreation)}
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
          <label htmlFor="description">Description</label>
          <Input
            id="description"
            type="text"
            placeholder="Enter description"
            className="dark:bg-zinc-700 bg-zinc-200"
            {...register("description", {
              required: "Description is required",
            })}
          />
        </div>
        <div className="flex justify-between w-full">
          <span>Theme</span>
          <Controller
            name="theme"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value}
                onValueChange={(value: themeType) => {
                  themeHandler(value);
                  onChange(value);
                }}
              >
                <SelectTrigger className="dark:text-white max-w-36">
                  <SelectValue placeholder="Change theme" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme !== "light"
                      ? "!bg-zinc-900 !text-white border-zinc-800"
                      : ""
                  }
                >
                  <SelectGroup>
                    <SelectLabel>Themes:</SelectLabel>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="w-full space-y-2">
          <span>Font</span>
          <Controller
            name="font"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="dark:text-white dark:bg-zinc-700 max-w-96">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme !== "light"
                      ? "!bg-zinc-900 !text-white border-zinc-800"
                      : ""
                  }
                >
                  <SelectGroup>
                    <SelectLabel>Fonts</SelectLabel>
                    <SelectItem value="font-mono">Mono</SelectItem>
                    <SelectItem value="font-serif">Serif</SelectItem>
                    <SelectItem value="font-sand">Sans</SelectItem>
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
            Create list
          </Button>
        )}
      </form>
    </div>
  );
};

export default CreateListForm;

// <div className="flex h-full w-full flex-col justify-center p-5 items-center">
//   <h1 className="dark:text-white text-4xl pb-11">Settings</h1>
//   <div className="flex justify-between w-full">
//     <span className="dark:text-white">Themes:</span>
//     <Select
//       onValueChange={(value: themeType) => {
//         themeHandler(value);
//       }}
//     >
//       <SelectTrigger className="dark:text-white max-w-36">
//         <SelectValue placeholder="Change theme" />
//       </SelectTrigger>
//       <SelectContent
//         className={
//           theme != "light" ? "!bg-black !text-white border-zinc-800" : ""
//         }
//       >
//         <SelectGroup>
//           <SelectLabel>Themes</SelectLabel>
//           <SelectItem value="light">Light</SelectItem>
//           <SelectItem value="dark">Dark</SelectItem>
//           <SelectItem value="black">Black</SelectItem>
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   </div>
//   <div className="flex justify-between w-full">
//     <span className="dark:text-white">Fonts:</span>
//     <Select
//       onValueChange={(value: themeType) => {
//         themeHandler(value);
//       }}
//     >
//       <SelectTrigger className="dark:text-white max-w-36">
//         <SelectValue placeholder="Change theme" />
//       </SelectTrigger>
//       <SelectContent
//         className={
//           theme != "light" ? "!bg-black !text-white border-zinc-800" : ""
//         }
//       >
//         <SelectGroup>
//           <SelectLabel>Fonts</SelectLabel>
//           <SelectItem value="light">sans</SelectItem>
//           <SelectItem value="dark">Dark</SelectItem>
//           <SelectItem value="black">Black</SelectItem>
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   </div>
// </div>;
