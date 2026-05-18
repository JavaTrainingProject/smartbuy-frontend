import axiosInstance from "./axiosInstance";

export const addToCart = async (productId) => {

    const response = await axiosInstance.post(
        "/cart/add",
        {
            productId: productId,
            quantity: 1
        }
    );

    return response.data;
};