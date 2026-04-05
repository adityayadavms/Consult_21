import axiosClient from "./axiosClient";

export const getMyQuestionsApi = async (page = 0, size = 10) => {
  const response = await axiosClient.get(
    `/questions/my?page=${page}&size=${size}`
  );

  return response.data;
};