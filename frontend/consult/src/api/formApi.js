import axiosClient from "./axiosClient";

export const getFormTemplateApi = async (categoryId) => {
  const response = await axiosClient.get(
    `/categories/${categoryId}/form`
  );

  console.log("AXIOS RAW:", response);

  return response.data; // this is ApiResponseDto
};