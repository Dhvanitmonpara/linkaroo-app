import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import getErrorFromAxios from "./getErrorFromAxios";
import { NavigateFunction } from "react-router-dom";

export const handleAxiosError = async (
  error: AxiosError,
  navigate: NavigateFunction
) => {
  const errorMsg = getErrorFromAxios(error);

  if (errorMsg === "Unauthorized request") {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/users/refresh-token`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-control-Allow-Origin": import.meta.env
              .VITE_ACCESS_CONTROL_ORIGIN,
          },
        }
      );
    } catch (refreshError) {
      navigate("/login");
      toast.error((t) => (
        <span className="space-x-3">
          <span>{errorMsg}</span>
          <button
            className="bg-red-500 text-white font-semibold hover:underline h-full w-auto rounded-sm py-1 px-3"
            onClick={() => {
              toast.dismiss(t.id);
              navigate("/login");
            }}
          >
            Login again
          </button>
        </span>
      ));
    }
  } else if (errorMsg) {
    toast.error(errorMsg);
  }
};
