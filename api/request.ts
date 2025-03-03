import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_API_URL } from "@/constants";

const client = axios.create({
  baseURL: BASE_API_URL,
});

export const request = async (options: AxiosRequestConfig<any>) => {
  /*let token;
  const state = store.getState();
  const userState = state?.user?.currentUser;
  if (userState === null) {
    token = "";
  } else {
    const { accessToken } = userState;
    token = accessToken;
  }

  token !== "" &&
    (client.defaults.headers.common.Authorization = `Bearer ${token}`);*/

  const onSuccess = (response: AxiosResponse<any, any>) => {
    return response?.data?.data;
  };

  const onError = (error: any) => {
    return Promise.reject(error.response?.data);
  };

  return client(options).then(onSuccess).catch(onError);
};
