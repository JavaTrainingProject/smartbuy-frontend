import axiosInstance from "./axiosInstance";


export const getProductsByCategory = async (
  categoryName
) => {

  const res =
    await axiosInstance.get(
      `/products/category/${categoryName}`
    );

  return res?.data?.data || [];
};

export const getAllProducts = (
  page = 0,
  size = 6
) => {

  return axiosInstance.get(
    `/products?page=${page}&size=${size}`
  );
};


export const getProductById = (id) => {

  return axiosInstance.get(
    `/products/${id}`
  );
};

export const createProduct = (
  formData
) => {

  return axiosInstance.post(
    `/products/create`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};


export const updateProduct = (
  id,
  formData
) => {

  return axiosInstance.put(
    `/products/${id}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};


export const deleteProduct = (
  id
) => {

  return axiosInstance.delete(
    `/products/${id}`
  );
};

export const softDeleteProduct = (
  id
) => {

  return axiosInstance.delete(
    `/products/${id}`
  );
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


export const searchProducts = async (productName) => {
  return await axiosInstance.get(
    `/products/getall-product?productName=${productName}`
  );
};