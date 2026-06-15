import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoBagAdd } from "react-icons/io5";
import { IoIosStar } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../Redux/cartSlice';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const category = useSelector((state) => state.category)
    const search = useSelector((state) => state.search)
    const [products, setProducts] = useState([])
    const productsPerPage = 10;
    const [pageNumber, setPageNumber] = useState(1)
    const [sortBy, setSortBy] = useState("featured")
    const dispatch = useDispatch()
    const cartStore = useSelector((state) => state.cart)
    const navigate = useNavigate()

   

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const { data } = await axios("https://cdn.jsdelivr.net/gh/adarshahelvar/NovaCart/products.json")
        setProducts(data)
    }

    // const currentProducts = products.slice((pageNumber - 1) * productsPerPage, pageNumber * productsPerPage)
    const lastIndex = pageNumber * productsPerPage;
    const firstIndex = lastIndex - productsPerPage;


    const filteredProducts = products.filter((product) => {
        const categoryMatch = category === "" || product.category.toLowerCase() === category.toLowerCase()



        const searchMatch = product.name.toLowerCase().includes((search || "").toLowerCase())

        return categoryMatch && searchMatch
    })

    const currentProducts = filteredProducts.slice(firstIndex, lastIndex)


    const sortedProducts = [...currentProducts];
    if (sortBy === "highToLow") {
        sortedProducts.sort((a, b) => b.price - a.price)
    }
    if (sortBy === "lowToHigh") {
        sortedProducts.sort((a, b) => (a.price - b.price))
    }
    if (sortBy === "A-Z") {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sortBy === "a-z") {
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
    }
    console.log("search =", search);
    console.log("filtered =", filteredProducts.length);

    const addHandler = (prod)=>{
        if(!auth.currentUser){
            navigate("/loginpage")
            return;
        }
        dispatch(addToCart(prod))
        toast.success("added to cart")
    }


    return (
        <div>
            <div className='container-fluid text-white d-flex align-items-center shadow'
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1800&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "400px",
                }}
            >
                <div className='container py-5'>
                    <h6 className='text-info fw-bolder'>NEW COLLECTION</h6>
                    <h1 className='display-5 fw-bold'>Shop reliable products for <br /> every work and life.</h1>
                    <p className='lead'>Curated electronics, fashion, home goods and accessories with a fast local cart<br /> experience</p>
                </div>

                <div className='glass-card d-flex flex-column flex-sm-row mt-4 bg-white bg-opacity-25 border border-light rounded text-white fw-bold fs-6' style={{ width: "100%",maxWidth:"500px", WebkitBackdropFilter: "blur(12px)" }}>
                    <div className='ps-4 flex-fill '>
                        <h2>50</h2>
                        <p>Products</p>
                    </div>
                    <div className='ps-4  flex-fill border-start'>
                        <h2>5</h2>
                        <p>Pages</p>
                    </div>
                    <div className='ps-4  flex-fill border-start'>
                        <h2>24h</h2>
                        <p>Dispatch</p>
                    </div>
                </div>
            </div>
            <div className='container my-5'>
            <div className='row'>
                <h2>Products</h2>
                <div className='d-flex justify-content-between'>
                    <p className='mb-4'>Showing {firstIndex + 1}-{lastIndex} of {products.length} <br /> products</p>
                    <select className='form-select w-75 p-1 h-50 px-3' value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="featured">Featured</option>
                        <option value="highToLow">High to Low</option>
                        <option value="lowToHigh">Low to High</option>
                        <option value="A-Z">A-Z</option>
                        <option value="a-z">a-z</option>
                    </select>
                </div>
                {
                    filteredProducts.length > 0 ? sortedProducts.map((prod, i) => (
                        <div className='col-12 col-sm-6 col-lg-4 col-xl-3 mb-4' key={i}>
                            <div className='card'>
                                <img src={prod.image} alt={prod.title} />
                                <div className='d-flex justify-content-between me-3 ms-3 mt-3'>
                                    <h6 className='border border-1 p-1 fs-6 rounded-5 bg-success-subtle text-success fw-bold'>{prod.category}</h6>
                                    <h6 className='text-warning'><IoIosStar className='text-warning mb-1' /> {prod.rating}</h6>
                                </div>
                                <h6 className='fw-bold  me-3 ms-3 mt-1 fs-6'>{prod.name}</h6>
                                <p className='me-3 ms-3 mt-4 text-light-emphasis'>{prod.description}</p>
                                <div className='d-flex justify-content-between me-3 ms-3 mt-2'>
                                    <h5 className='fw-bold'>${prod.price}</h5>
                                    <button className='btn btn-dark mb-3 text-center px-3 py-1' onClick={()=>addHandler(prod)}><IoBagAdd className='mb-1' /> Add</button>
                                </div>
                            </div>
                        </div>
                    )) : <h2 className='text-center'>loading....</h2>
                }
            </div>
            </div>

            <div className='text-center mb-5'>
                <button className='bg-white rounded-2 px-2 py-1 me-2' disabled={pageNumber === 1} onClick={() => setPageNumber(pageNumber - 1)}>Previous</button>
                {
                    products && products.length > 0 ? [1, 2, 3, 4, 5].map((num) => (
                        <button className='btn btn-white border-1 border-black me-2' style={{ backgroundColor: pageNumber === num ? "black" : "white", color: pageNumber != num ? "black" : "white" }} key={num} onClick={() => setPageNumber(num)}>{num}</button>
                    )) : <h4>page loading...</h4>
                }
                <button className='bg-white rounded-2 px-2 py-1 me-2' disabled={pageNumber === 5} onClick={() => setPageNumber(pageNumber + 1)}>Next</button>
            </div>
        </div>

    )
}

export default HomePage
