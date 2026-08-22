import { apiClient } from "@/utils/apiClient";


export const LoginApi = async (
  url:string,
  {arg}:{arg:{mobile:string}}
)=>{

  const response = await apiClient.post(url,arg);

  return response.data;
};