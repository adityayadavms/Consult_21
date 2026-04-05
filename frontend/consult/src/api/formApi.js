import axiosClient from "./axiosClient";

export const getFormTemplateApi = async (categoryId) => {
  const response = await axiosClient.get(
    `/categories/${categoryId}/form`
  );
  return response.data;
};