import axios from "axios";
import { toast } from "react-toastify";

export function handleError(error: unknown) {
  let messages = "An unknown error occurred";
  if (axios.isAxiosError(error)) {
    messages = error.response?.data?.message;
    toast(messages, {
      type: "error",
    });
  }
}
