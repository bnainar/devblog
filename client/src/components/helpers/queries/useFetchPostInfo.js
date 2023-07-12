import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const getPostInfo = async (id) => {
  const { data } = await axios({ url: `/post/${id}` });
  return data;
};
export const useFetchPostInfo = (id) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["post", { id }],
    queryFn: () => getPostInfo(id),
    retry: 2,
    initialData: () =>
      queryClient.getQueryData(["posts"])?.find((post) => post._id === id),
  });
};
