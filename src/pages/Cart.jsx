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
                    <button className='btn-close' onClick={() =>{ setShowCart(false);
                        navigate("/")}}> 
                         </button>
                    <p>{cartStore.reduce((total, item) => total + item.quantity, 0)} items</p>
                </div>

                {
                    cartStore && cartStore.length > 0 ? cartStore.map((cart, i) => (
                        <div className='row border-bottom m-2 cart-items h-50' key={i}>
                            <div className='col-lg-8 d-flex mb-1'>
                                <img src={cart.image} alt="" width="50%" height="70px" className='rounded-4' />
                                <div className='ms-3'>
                                    <h6 className='fw-bold mb-1'>{cart.name}</h6>
                                    <small className='text-muted fs-5'>${cart.price} each</small>

                                </div>
                                <div className=' px-2 py-1 d-flex flex-column'>
                                    <HiMinusSmall className='fs-4 ms-1' onClick={() => dispatch(decreaseQty(cart.id))} />


                                    <h5 className='ms-2'>{cart.quantity}</h5>
                                    <HiOutlinePlusSmall className='fs-3 me-1' onClick={() => dispatch(increaseQty(cart.id))} />


                                </div>
                            </div>
                            <div className='col-4 text-end'>
                                <FaTrashAlt className='text-danger fs-5' onClick={() => trashHandler(cart.id)} />

                                <h6 className='fw-bold fs-5 mt-5'>${cart.price * cart.quantity}</h6>
                            </div>
                        </div>
                    )) : <></>
                }

                {
                    cartStore.length > 0 && (
                        <div className='cart-footer border-top'>
                            <div className='d-flex justify-content-between me-4 ms-4 '>
                                <p className='text-muted'>Subtotal</p>
                                <h6>${totalPrice.toFixed(2)}</h6>
                            </div>
                            <div className='d-flex justify-content-between me-4 ms-4'>
                                <p className='text-muted'>Estimated shipping</p>
                                <h6>${shipping.toFixed(2)}</h6>
                            </div>
                            <div className='d-flex justify-content-between me-4 ms-4 '>
                                <h6 className=''>Total</h6>
                                {
                                    totalPrice && <h4>${total.toFixed(2)}</h4>
                                }
                            </div>

                            <button className='btn btn-outline-danger  px-4 py-2 rounded w-25  d-inline-block text-center fw-bold me-5 ms-5 text-nowrap' onClick={() => { dispatch(clearCart()), toast.success("cart is cleared") }}>Clear cart</button>
                            <button className='btn btn-outline-success  py-2 rounded w-25  d-inline-block text-center fw-bold text-nowrap' onClick={placeOrder}>Place Order</button>
                            <button className='btn bg-black px-4 py-2 rounded w-75 mt-1 d-inline-block text-center text-white fw-bold me- ms-4'>Checkout</button>


                        </div>
                    )
                }

            </div>
        </>

    );

}

export default Cart;
