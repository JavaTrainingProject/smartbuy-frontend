import axiosInstance from "./axiosInstance";


export const getAllProducts = async () => {

  const res = await axiosInstance.get(
    "/products?page=0&size=50"
  );

  console.log("PRODUCT RESPONSE:", res.data);

  return res.data?.data?.content || [];
};


export const getProductById = async (id) => {

  const res = await axiosInstance.get(
    `/products/${id}`
  );

  return res.data?.data;
};


export const getProductsByCategory = async (
  categoryName
) => {

  const res = await axiosInstance.get(
    "/products?page=0&size=50"
  );

  const products =
    res.data?.data?.content || [];

  return products.filter(
    (product) =>

      product.categoryName
        ?.toLowerCase() ===
      categoryName?.toLowerCase()
  );
};
export const createProduct =
  async (formData) => {

    const res =
      await axiosInstance.post(
        "/products/create",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return res.data;
};