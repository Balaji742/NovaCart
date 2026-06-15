import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { HiMinusSmall } from "react-icons/hi2";
import { FaTrashAlt } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { toast } from 'react-toastify';
import { clearCart, decreaseQty, increaseQty, removeFromCart } from '../Redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = ({ showCart, setShowCart }) => {
    console.log("cart render", showCart)
    if (!showCart) return null;

    const cartStore = useSelector((state) => state.cart)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const trashHandler = (id) => {
        dispatch(removeFromCart(id))
        toast.error("Item removed From Cart")
    }

    const placeOrder = async () => {
        if (cartStore.length === 0) {
            alert("cart is empty");
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
            })
            // dispatch(clearCart());
            // localStorage.removeItem("cart");
            alert("order placed successfully")
        } catch (error) {
            alert(error.message)
            // return;
        }
    }
    const totalPrice = cartStore.reduce((acc, cart) => acc + cart.price * cart.quantity, 0)
    const shipping = 8.50;
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
                }} className='cart-sidebar'
            >
                <div className='d-flex justify-content-between m-3 border-bottom  card-header'>
                    <h3>Shopping Cart</h3>
                    <button className='btn-close' onClick={() => {
                        setShowCart(false);
                        navigate("/")
                    }}>
                    </button>
                    <p>{cartStore.reduce((total, item) => total + item.quantity, 0)} items</p>
                </div>

                {
                    cartStore && cartStore.length > 0 ? cartStore.map((cart, i) => (
                        <div className='border-bottom p-3' key={i}>
                            <div className='d-flex align-items-center gap-3 flex-wrap'>
                                <img src={cart.image} alt="" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                                <div className='flex-grow-1'>
                                    <h6 className='fw-bold mb-1'>{cart.name}</h6>
                                    <small className='text-muted'>${cart.price} eachsdfg</small>

                                </div>
                                <div className='text-center'>
                                    <HiMinusSmall className='fs-4 ms-1' onClick={() => dispatch(decreaseQty(cart.id))} />


                                    <h5 className='ms-2'>{cart.quantity}</h5>
                                    <HiOutlinePlusSmall className='fs-3 me-1' onClick={() => dispatch(increaseQty(cart.id))} />
                                </div>
                            </div>
                            <div className='text-end'>
                                <FaTrashAlt className='text-danger fs-5' onClick={() => trashHandler(cart.id)} />

                                <h6 className='fw-bold'>${cart.price * cart.quantity}</h6>
                            </div>
                        </div>
                    )) : <></>
                }

                {
                    cartStore.length > 0 && (
                        <div className='cart-footer border-top pt-3'>
                            <div className='d-flex justify-content-between'>
                                <p className='text-muted'>Subtotal</p>
                                <h6>${totalPrice.toFixed(2)}</h6>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <p className='text-muted'>Estimated shipping</p>
                                <h6>${shipping.toFixed(2)}</h6>
                            </div>
                            <div className='d-flex justify-content-between fs-5'>
                                <h6 className=''>Total</h6>
                                {
                                    totalPrice && <h4>${total.toFixed(2)}</h4>
                                }
                            </div>

                            <div className='d-grid gap-2 mt-3'>
                                <button className='btn btn-outline-danger rounded' onClick={() => { dispatch(clearCart()), toast.success("cart is cleared") }}>Clear cart</button>
                                <button className='btn btn-outline-success' onClick={placeOrder}>Place Order</button>
                                <button className='btn bg-black'>Checkout</button>
                            </div>

                        </div>
                    )
                }

            </div>
        </>

    );

}

export default Cart;
