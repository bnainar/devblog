import axios from "axios";
export const getPostsByUser = async (username, pageNo = 0, limit) => {
  const { data } = await axios({
    url: `/post/author/${username}?page=${pageNo}&limit=${limit}`,
  });
  return data;
};
export const getAllPosts = async (pageNo = 0, limit) => {
  const { data } = await axios({
    url: `/post/all?page=${pageNo}&limit=${limit}`,
  });
  return data;
};
