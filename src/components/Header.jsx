import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setCategory } from '../Redux/categorySlice'
import { CiSearch } from "react-icons/ci";
import { setSearch } from '../Redux/searchSlice';
import { FiShoppingCart } from "react-icons/fi";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
// import { current } from '@reduxjs/toolkit';
import { addToCart, clearCart, restoreCart } from '../Redux/cartSlice';
import { toast } from 'react-toastify';
import { setLoggingOut } from '../Redux/store';
// import { getCartKey } from '../Redux/store';
import { IoReorderFourOutline } from "react-icons/io5";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";


const Header = ({ setShowCart }) => {
    const category = useSelector((state) => state.category)
    const cart = useSelector((state) => state.cart)
    const search = useSelector((state) => state.search)
    const dispatch = useDispatch()
    const cartStore = useSelector((state) => state.cart)
    const totalItems = cartStore.length;
    const [showSearch, setShowSearch] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const key = `cart_${currentUser.uid}`;
                try {
                    const saved = localStorage.getItem(key);
                    if (saved) {
                        const items = JSON.parse(saved);
                        dispatch(restoreCart(items));
                    } else {
                        dispatch(clearCart())
                    }
                } catch (error) {
                    console.error("Failed to load cart", error);
                }
            } else {
                dispatch(clearCart());
            }
        });

        return () => unsubscribe();
    }, []);

    const logoutHandler = async () => {
        setLoggingOut(true);
        dispatch(clearCart());
        await signOut(auth);
        setLoggingOut(false);
        toast.success("Logout successful");
    };

    return (
        <nav className="navbar navbar-expand-lg p-3 ">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand fw-bold">NovaCart</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/homepage" className="nav-link active" aria-current="page" >Shop</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/aboutpage" className="nav-link active" aria-current="page"  >About</Link>
                        </li>
                    </ul>

                    <div className="d-flex flex-column flex-lg-row gap-2 align-items-lg-center">
                        <form className="d-flex">
                            {
                                showSearch && (
                                    <input className="form-control me-2" type="search" placeholder="Fashion" aria-label="Search" onChange={(e) => dispatch(setSearch(e.target.value))} />
                                )
                            }

                            <button className='btn btn-light border-secondary me-2 bg-white' type='button' onClick={() => setShowSearch(!showSearch)}><CiSearch className='fs-4' /></button>

                        </form>
                        <select className='form-select w-auto me-2' onChange={(e) => dispatch(setCategory(e.target.value))}>
                            <option value="">All Categories</option>
                            <option value="beauty">Beauty</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home">Home</option>
                            <option value="outdoor">Outdoor</option>
                            <option value="sports">Sports</option>
                        </select>

                        {
                            user ? (
                                <div className="dropdown me-2">
                                    <button
                                        className="btn btn-outline-dark"
                                        data-bs-toggle="dropdown"><IoReorderFourOutline className='fs-4' />
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="/profilepage" className='dropdown-item' ><CgProfile className='bg-black text-light rounded-circle fs-4' /> Profile</Link>
                                        </li>
                                        <li>
                                            <Link to="/orderspage" className='dropdown-item' >Orders</Link>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={logoutHandler}>Logout <RiLogoutBoxRFill className='fs-4' />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="me-2">
                                    <Link to="/loginpage" className="btn btn-outline-primary">Login</Link>
                                </div>
                            )}
                        <Link to="/cart" className="btn btn-dark me-2 position-relative" type="button" onClick={() => { setShowCart(true) }}><FiShoppingCart /> {cartStore.length > 0 && (<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{totalItems}</span>)}</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header