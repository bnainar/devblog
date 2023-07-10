import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const verifyToken = async () => {
  const { data } = await axios({
    url: "/auth/token",
    withCredentials: true,
  });
  return data;
};

export const useTokenValidation = () => {
  return useQuery({
    queryFn: verifyToken,
    queryKey: ["userInfo"],
    retry: 2,
  });
};
