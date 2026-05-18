import axiosInstance from "./axiosInstance";

export const getActiveCategories = async () => {

  try {

    const res = await axiosInstance.get(
      "/admin/categories/active?page=0&size=50"
    );

    console.log("CATEGORY API RESPONSE:", res.data);

  
    if (res.data?.data?.content) {

      return res.data.data.content;

    }

  
    if (Array.isArray(res.data?.data)) {

      return res.data.data;

    }

  
    if (Array.isArray(res.data)) {

      return res.data;

    }

    return [];

  } catch (error) {

    console.log("CATEGORY FETCH ERROR:", error);

    return [];

  }
};

export const getSubCategoriesByCategory =
  async (categoryId) => {

    return await axiosInstance.get(
      `/subcategory/categories/${categoryId}/subcategories`
    );
};