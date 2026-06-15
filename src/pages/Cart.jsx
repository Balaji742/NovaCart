import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlinePlusSmall, HiMinusSmall } from "react-icons/hi2";
import { FaTrashAlt } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import {
    clearCart,
    decreaseQty,
    increaseQty,
    removeFromCart
} from '../Redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = ({ showCart, setShowCart }) => {
    if (!showCart) return null;

    const cartStore = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const trashHandler = (id) => {
        dispatch(removeFromCart(id));
        toast.error("Item removed from cart");
    };

    const placeOrder = async () => {
        if (cartStore.length === 0) {
            alert("Cart is empty");
            return;
        }

        try {
            await addDoc(collection(db, "orders"), {
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                items: cartStore,
                totalItems: cartStore.length,
                orderDate: new Date(),
                createdAt: serverTimestamp()
            });

            alert("Order placed successfully");
        } catch (error) {
            alert(error.message);
        }
    };

    const totalPrice = cartStore.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const shipping = 8.5;
    const total = totalPrice + shipping;

    return (
        <>
            <div
                onClick={() => setShowCart(false)}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 9998
                }}
            />

            <div
                className="cart-sidebar"
                style={{
                    position: "fixed",
                    right: 0,
                    top: 0,
                    width: "450px",
                    height: "100vh",
                    background: "white",
                    zIndex: 9999,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h3 className="m-0">Shopping Cart</h3>

                    <div className="d-flex align-items-center gap-3">
                        <p className="m-0">
                            {cartStore.reduce(
                                (total, item) => total + item.quantity,
                                0
                            )} items
                        </p>

                        <button
                            className="btn-close"
                            onClick={() => {
                                setShowCart(false);
                                navigate("/");
                            }}
                        />
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-grow-1">
                    {cartStore.length > 0 ? (
                        cartStore.map((cart, i) => (
                            <div className="border-bottom py-3 px-3" key={i}>
                                <div className="d-flex justify-content-between align-items-center">

                                    <div className="d-flex align-items-center gap-3">
                                        <img
                                            src={cart.image}
                                            alt={cart.name}
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                objectFit: "cover",
                                                borderRadius: "8px"
                                            }}
                                        />

                                        <div>
                                            <h6 className="fw-bold mb-1">
                                                {cart.name}
                                            </h6>

                                            <small className="text-muted">
                                                ${cart.price} each
                                            </small>
                                        </div>
                                    </div>

                                    <div className="text-end">

                                        <div className="d-flex align-items-center gap-2 justify-content-end mb-2">
                                            <HiMinusSmall
                                                className="fs-4"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => dispatch(decreaseQty(cart.id))}
                                            />

                                            <span className="fw-bold">
                                                {cart.quantity}
                                            </span>

                                            <HiOutlinePlusSmall
                                                className="fs-4"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => dispatch(increaseQty(cart.id))}
                                            />
                                        </div>

                                        <h6 className="fw-bold mb-2">
                                            ${(cart.price * cart.quantity).toFixed(2)}
                                        </h6>

                                        <FaTrashAlt
                                            className="text-danger fs-5"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => trashHandler(cart.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center mt-5">
                            <h5>Your cart is empty</h5>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartStore.length > 0 && (
                    <div className="border-top p-3">

                        <div className="d-flex justify-content-between">
                            <p className="text-muted">Subtotal</p>
                            <h6>${totalPrice.toFixed(2)}</h6>
                        </div>

                        <div className="d-flex justify-content-between">
                            <p className="text-muted">Estimated shipping</p>
                            <h6>${shipping.toFixed(2)}</h6>
                        </div>

                        <div className="d-flex justify-content-between fs-5">
                            <h6>Total</h6>
                            <h4>${total.toFixed(2)}</h4>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    dispatch(clearCart());
                                    toast.success("Cart cleared");
                                }}
                            >
                                Clear Cart
                            </button>

                            <button
                                className="btn btn-outline-success"
                                onClick={placeOrder}
                            >
                                Place Order
                            </button>

                            <button className="btn btn-dark">
                                Checkout
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;