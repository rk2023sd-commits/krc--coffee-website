import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
    return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchWishlist();
        }
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5000/api/wishlist', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setWishlistItems(data.data);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to add to wishlist');
                return;
            }

            // Optimistic update
            const isAlreadyIn = wishlistItems.some(item => item._id === product._id);
            if (isAlreadyIn) {
                // If checking logic is needed here or we just rely on backend
                // For toggle behavior, we might want to remove if exists, but usually "add" is distinct
                return;
            }

            const response = await fetch(`http://localhost:5000/api/wishlist/${product._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                // The backend returns the list of IDs usually, but our controller returns populated or list
                // Check controller: returns user.wishlist (which is populated?? Let's check controller again)
                // userController: res.status(200).json({ success: true, data: user.wishlist }) (Wait, is it populated?)
                // In addToWishlist controller: user.wishlist.push(productId). await user.save(). res... data: user.wishlist
                // If it's not populated, we might have issues displaying.
                // It's better if we just re-fetch or if we append the product object manually if success.

                // Let's refetch to be safe and consistent with population
                fetchWishlist();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            setWishlistItems(prev => prev.filter(item => item._id !== productId));

            const response = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!data.success) {
                // Revert if failed
                fetchWishlist();
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist,
            loading,
            fetchWishlist // exposed if needed to manually refresh
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
