import axiosInstance from "./axiosInstance";

export const getActiveCategories = async () => {

  try {

    const res = await axiosInstance.get(
      "/admin/categories/active?page=0&size=50"
    );

    console.log(
      "CATEGORY API RESPONSE:",
      res.data
    );

    // CASE 1
    if (
      res.data?.data?.content
    ) {

      return res.data.data.content;

    }

    // CASE 2
    if (
      Array.isArray(res.data?.data)
    ) {

      return res.data.data;

    }

    // CASE 3
    if (
      Array.isArray(res.data)
    ) {

      return res.data;

    }

    return [];

  } catch (error) {

    console.log(
      "CATEGORY FETCH ERROR:",
      error
    );

    return [];

  }
};