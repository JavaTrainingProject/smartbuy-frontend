import axiosInstance from "./axiosInstance";

export const addToWishlist = async (productId) =>{

    const response = await axiosInstance.post(`/wishlist/add/${productId}`);
    return response.data;
};

export const getWishlist = async (userId, page=0) =>{
    const response = await axiosInstance.get(`/wishlist/${userId}?page=${page}&size=6`);

    return response.data;
};

export const removeFromWishlist = async (wishlistId) =>{
    const response = await axiosInstance.delete(`/wishlist/remove/${wishlistId}`);

    return response.data;
};