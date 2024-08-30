import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import getErrorFromAxios from "./getErrorFromAxios";
import { NavigateFunction } from "react-router-dom";

export const handleAxiosError = (error: AxiosError, navigate: NavigateFunction) => {
  const errorMsg = getErrorFromAxios(error);

  if (errorMsg === "Unauthorized request") {
    navigate("/login");
  } else if (errorMsg) {
    toast.error(errorMsg);
  }
};
