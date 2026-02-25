import axiosInstance from "../lib/axiosInstance";

export const submitSupportFeedback = (data) =>
  axiosInstance.post("/support/feedback", data);
