import { useEffect, useState } from "react";

import {getWishlist,removeFromWishlist} from "../services/wishlistService";

import UserNavbar from "../components/UserNavbar";

import Toast from "../components/Toast";

import "../styles/WishlistPage.css";
import { addToCart } from "../services/cartService";

export default function WishlistPage() {

    const [wishlist, setWishlist] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [totalPages, setTotalPages] =
        useState(0);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [toast, setToast] =
        useState({
            show: false,
            message: "",
            type: ""
        });

    useEffect(() => {

        fetchWishlist();

    }, [currentPage]);

   
    const fetchWishlist = async () => {

        try {

            const userId = localStorage.getItem( "userId");

            console.log( "USER ID:", userId);

            if(!userId){

                showToast( "User not found", "error");

                return;
            }

            const data =await getWishlist(userId,currentPage - 1);

            if( Array.isArray(data.content )
            ) {

                setWishlist(data.content);

                setTotalPages(data.totalPages);

            } else {

                setWishlist([]);
            }

        } catch(error) {
            showToast("Failed to load wishlist","error");

        } finally {

            setLoading(false);
        }
    };

    const handleRemove = async (
        wishlistId
    ) => {

        try {

            await removeFromWishlist( wishlistId);

            setWishlist(
                wishlist.filter(
                    (item) =>
                        item.wishlistId !==
                        wishlistId
                )
            );

            showToast("Product removed from wishlist","success");

        } catch(error) {

            showToast("Failed to remove product","error");
        }
    };

 
    const handleAddCart = async (productId) => {
         await addToCart(productId);
        try {

            showToast("Product added to cart","success");

        } catch(error){

            
            showToast("Failed to add product to cart","error");
        }
    };

    const showToast = (
        message,
        type
    ) => {

        setToast({
            show: true,
            message,
            type
        });

        setTimeout(() => {

            setToast({
                show: false,
                message: "",
                type: ""
            });

        }, 3000);
    };

   

    return (

        <div className="wishlist-layout">

            <UserNavbar />

            <div className="wishlist-content">

               
                <div className="wishlist-header">

                    <div>

                        <h1>
                            My Wishlist
                        </h1>

                        <p>
                            Your favorite items,
                            all in one place.
                        </p>

                    </div>

                    <div className="wishlist-count">

                        ❤️ {wishlist ?.length || 0 } Items

                    </div>

                </div>

             
                {
                   wishlist=== null ? null: wishlist.length === 0 ? (

                        <div className="empty-box">

                            <h2>
                                Wishlist is empty
                            </h2>

                        </div>

                    ) : (

                        <>
                        
                        
                        <div className="wishlist-grid">

                            {
                                wishlist.map(
                                    (item) => (

                                    <div
                                        className="wishlist-card"
                                        key={
                                            item.wishlistId
                                        }
                                    >

                                        <img
                                            src={
                                                item.image_url
                                            }
                                            alt={
                                                item.product_name
                                            }
                                            className="wishlist-image"
                                        />

                                        <h3>
                                            {
                                                item.product_name
                                            }
                                        </h3>

                                        <p className="wishlist-description">

                                            {
                                                item.productDescription
                                            }

                                        </p>

                                        <h2>
                                            ₹{
                                                item.price
                                            }
                                        </h2>

                                        {/* BUTTONS */}
                                        <div className="wishlist-buttons">

                                            <button
                                                className="cart-btn"
                                                onClick={() =>
                                                    handleAddCart(
                                                        item.product_id
                                                    )
                                                }
                                            >
                                                Add to Cart
                                            </button>

                                            <button
                                                className="remove-btn"
                                                onClick={() =>
                                                    handleRemove(
                                                        item.wishlistId
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>
                                ))
                            }

                        </div>

                       
                        <div className="pagination">

                            <button
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage - 1
                                    )
                                }
                            >
                                Prev
                            </button>

                            {
                                [...Array(totalPages)].map(
                                    (_, index) => (

                                    <button
                                        key={index}
                                        className={
                                            currentPage ===
                                            index + 1
                                            ? "active-page"
                                            : ""
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                index + 1
                                            )
                                        }
                                    >
                                        {index + 1}
                                    </button>
                                ))
                            }

                            <button
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage + 1
                                    )
                                }
                            >
                                Next
                            </button>

                        </div>

                        </>
                    )
                }

            </div>

            {/* TOAST */}
            {
                toast.show && (

                    <Toast
                        message={toast.message}
                        type={toast.type}
                    />
                )
            }

        </div>
    );
}