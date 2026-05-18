import axiosInstance from "./axiosInstance";


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


export const getAllProducts = async (
  page = 0,
  size = 6
) => {

  const res =
    await axiosInstance.get(
      `/products?page=${page}&size=${size}`
    );

  console.log(
    "Product Response:",
    res.data
  );

  return res;
};


export const getProductById = async (
  id
) => {

  const res =
    await axiosInstance.get(
      `/products/${id}`
    );

  return res.data?.data;
};


export const createProduct = async (
  formData
) => {

  const res =
    await axiosInstance.post(
      `/products/create`,
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


export const updateProduct = async (
  id,
  formData
) => {

  const res =
    await axiosInstance.put(
      `/products/${id}`,
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


export const deleteProduct = async (
  id
) => {

  const res =
    await axiosInstance.delete(
      `/products/${id}`
    );

  return res.data;
};


export const softDeleteProduct = async (
  id
) => {

  const res =
    await axiosInstance.delete(
      `/products/${id}`
    );

  return res.data;
};


export const toggleProductStatus = async (
  id,
  status
) => {

  const res =
    await axiosInstance.patch(
      `/products/${id}/status?status=${status}`
    );

  return res.data;
};