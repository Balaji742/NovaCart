import { createSlice } from "@reduxjs/toolkit";

// const savedCart = (()=>{
//     try {
//         const cart = localStorage.getItem("cart");
//         return cart ? JSON.parse(cart) : [];
//     } catch {
//         return[]
//     }
// })();

const cartSlice = createSlice({
    name: "cart",
    initialState: [],
    reducers: {
        addToCart(state, action) {
            const item = state.find(cart => cart.id === action.payload.id);
            if (item) {
                item.quantity += 1;
            }else{
            state.push({ ...action.payload, quantity: 1 })
        }
        },

        removeFromCart(state, action) {
            return state.filter((cart) => cart.id !== action.payload)
        },

        increaseQty(state, action) {
            const item = state.find(cart => cart.id === action.payload)
            if (item) {
                item.quantity += 1;
            }
        },

        decreaseQty(state, action) {
            const item = state.find(cart => cart.id === action.payload)
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
        clearCart(state){
            return []
        },
        restoreCart(state,action){
            return action.payload
        }
    }
});

export const { addToCart, removeFromCart, increaseQty, decreaseQty,clearCart, restoreCart } = cartSlice.actions
export default cartSlice.reducer