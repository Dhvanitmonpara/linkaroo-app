import { useState } from "react";
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
import { fontOptions, themeType } from "@/lib/types";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import useProfileStore from "@/store/profileStore";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "@/utils/handlerAxiosError";

type HandleSettingsType = {
  theme: themeType;
  font: fontOptions;
};

const SettingsForm = () => {

  const [loading, setLoading] = useState(false);
  const { changeTheme, updateProfile, profile, changeFont } = useProfileStore();
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm<HandleSettingsType>({
    defaultValues: {
      theme: profile.theme,
      font: profile.font,
    },
  });

  const handleUpdateSettings = async (data: HandleSettingsType) => {
    try {

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/users/settings/update`,
        data,
        { withCredentials: true }
      );

      if (response.status !== 200) {
        toast.error("Failed to update settings");
      }
      updateProfile(response.data.data);
    } catch (error) {
      handleAxiosError(error as AxiosError, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:text-white p-5 flex flex-col justify-center items-center space-y-3">
      <h1 className="text-3xl">Settings</h1>
      <form
        className="h-4/5 flex flex-col space-y-6 sm:w-96 w-72 justify-center items-center"
        onSubmit={handleSubmit(handleUpdateSettings)}
      >
        <div className="w-full space-y-2">
          <span>Theme</span>
          <Controller
            name="theme"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value}
                onValueChange={(value: themeType) => {
                  changeTheme(value);
                  onChange(value);
                }}
              >
                <SelectTrigger className="dark:text-white dark:bg-zinc-700 max-w-96">
                  <SelectValue placeholder="Change theme" />
                </SelectTrigger>
                <SelectContent
                  className="dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
                >
                  <SelectGroup>
                    <SelectLabel>Themes</SelectLabel>
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
              <Select value={value} onValueChange={(value: fontOptions) => {
                onChange(value)
                changeFont(value)
              }}>
                <SelectTrigger className="dark:text-white dark:bg-zinc-700 max-w-96">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent
                  className="dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
                >
                  <SelectGroup>
                    <SelectLabel>Fonts</SelectLabel>
                    <SelectItem value="font-mono">Mono</SelectItem>
                    <SelectItem value="font-serif">Serif</SelectItem>
                    <SelectItem value="font-sans">Sans</SelectItem>
                    <SelectItem value="font-helvetica">Helvetica</SelectItem>
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
            Save changes
          </Button>
        )}
      </form>
    </div>
  );
};

export default SettingsForm;
