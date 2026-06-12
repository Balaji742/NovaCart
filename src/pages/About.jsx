import React from 'react'
import { HiOutlineBolt } from "react-icons/hi2";
import { IoBagCheckOutline } from "react-icons/io5";
import { BsShieldLock } from "react-icons/bs";

const About = () => {
    return (
        <div className=''>
            <div className='bg-black text-light p-5' style={{ minHeight: "400px" }}>
                <h6 className='text-info fw-bolder ms-5 mt-5'>About NovaCart</h6>
                <h2 className='fw-bold ms-5'>A polished front-end<br />ecommerce experience built for<br />real-world practice</h2>
                <p className='fs-6 lead ms-5'>NovaCart demonstrates product APIs, persistent carts, pagination, account flows, and<br />responsive Bootstrap design in a static project.</p>
            </div>

            <div className='container-fluid'>
                <div className='row d-flex justify-content-around mt-5'>
                    <div className='col-lg-3 card'>
                        <HiOutlineBolt className='border fs-3 p-1 mt-2 mb-2 text-success bg-success-subtle rounded'/>
                        <h6 className='fw-bold'>Fast Catalog</h6>
                        <small className='mb-2'>products are loaded from JSON and rendered with<br />efficient search, filter, sort, and pagination controls.</small>
                    </div>
                    <div className='col-lg-3 card'>
                        <IoBagCheckOutline  className='border fs-3 p-1 mb-2 mt-2 text-success bg-success-subtle rounded'/>
                        <h6 className='fw-bold'>Persistent Cart</h6>
                        <small className='mb-2'>Cart items and quantities are saved in browser<br />Storage, so the shopping flow survives refreshs.</small>
                    </div>
                    <div className='col-lg-3 card'>
                        <BsShieldLock className='border fs-3 p-1 mb-2 mt-2 text-success bg-success-subtle rounded'/>
                        <h6 className='fw-bold'>Account Flow</h6>
                        <small className='mb-2'>Registration and login include validation, duplicate<br />checks, password hashing, and session handling.</small>
                    </div>
                </div>
            </div>

            <div className='container pt-5 mb-5'>
                <div className='row '>
                    <div className='d-flex justify-content-around pt-3 border rounded-2 bg-secondary-subtle'>
                        <div>
                            <h3>Built with practical standards</h3>
                            <small className='text-muted mb-'>The app keeps concerns seperated across markup, styling, catalog logic, and<br/>authentication logic. it is esay to host as a static site and easy to connect to real <br/>backend later.</small>
                        </div>
                        <div className='pt-3'>
                            <span className='border border-black bg-white rounded-5 p-2  me-3 '>HTML5</span>
                            <span className='border border-black bg-white rounded-5 p-2 me-3 '>CSS3</span>
                            <span className='border border-black bg-white rounded-5 p-2 me-3 '>Bootstrap5</span>
                            <span className='border border-black bg-white rounded-5 p-2 me-3 '>JavaScript</span>
                            <span className='border border-black bg-white rounded-5 p-2'>JSON API Ready</span><br/><br/>
                            <span className='border border-black bg-white rounded-5 p-2 mt-3'>LocalStorage</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default About
