import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_API_URL } from "@/constants";

const client = axios.create({
  baseURL: BASE_API_URL,
});

export const request = async (options: AxiosRequestConfig<any>) => {
  const onSuccess = (response: AxiosResponse<any, any>) => {
    return response.data;
  };

  const onError = (error: any) => {
    return Promise.reject(error.response?.data);
  };

  return client(options).then(onSuccess).catch(onError);
};
