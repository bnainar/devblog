import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getPostInfo = async (id) => {
  const { data } = await axios({ url: `/post/${id}` });
  return data;
};
export const useFetchPostInfo = (id) => {
  return useQuery({
    queryKey: ["post", { id }],
    queryFn: () => getPostInfo(id),
    retry: 2,
  });
};
