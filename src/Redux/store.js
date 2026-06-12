import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice";
import searchReducer from "./searchSlice";
import cartReducer from "./cartSlice";
import { auth } from "../firebase";

export const getCartKey = () =>
    auth.currentUser ? `cart_${auth.currentUser.uid}` : null;
let isLoggingOut = false;

export const setLoggingOut = (val) =>{
    isLoggingOut = val;
}

const loadCart = () => {
    try {
        const key = getCartKey();
        if (!key) return [];
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

export const store = configureStore({
    reducer: {
        category: categoryReducer,
        search: searchReducer,
        cart: cartReducer,
    },
    preloadedState: {
        cart: loadCart(),
    }
});

store.subscribe(() => {
    if(isLoggingOut) return
    const key = getCartKey();
    if (!key) return;
    const state = store.getState();
    localStorage.setItem(key, JSON.stringify(state.cart));
});

export default store;