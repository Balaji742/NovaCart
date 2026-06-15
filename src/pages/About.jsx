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
                        <HiOutlineBolt className='border fs-3 p-1 mt-2 mb-2 text-success bg-success-subtle rounded' />
                        <h6 className='fw-bold'>Fast Catalog</h6>
                        <small className='mb-2'>products are loaded from JSON and rendered with<br />efficient search, filter, sort, and pagination controls.</small>
                    </div>
                    <div className='col-lg-3 card'>
                        <IoBagCheckOutline className='border fs-3 p-1 mb-2 mt-2 text-success bg-success-subtle rounded' />
                        <h6 className='fw-bold'>Persistent Cart</h6>
                        <small className='mb-2'>Cart items and quantities are saved in browser<br />Storage, so the shopping flow survives refreshs.</small>
                    </div>
                    <div className='col-lg-3 card'>
                        <BsShieldLock className='border fs-3 p-1 mb-2 mt-2 text-success bg-success-subtle rounded' />
                        <h6 className='fw-bold'>Account Flow</h6>
                        <small className='mb-2'>Registration and login include validation, duplicate<br />checks, password hashing, and session handling.</small>
                    </div>
                </div>
            </div>

            <div className='container pt-5 mb-5'>
                <div className='row'>
                    <div className='d-flex flex-column flex-md-row justify-content-between align-items-start border rounded-2 bg-secondary-subtle p-4'>

                        <div className='mb-4 mb-md-0'>
                            <h3>Built with practical standards</h3>
                            <small className='text-muted'>
                                The app keeps concerns separated across markup, styling,
                                catalog logic, and authentication logic. It is easy to host
                                as a static site and easy to connect to a real backend later.
                            </small>
                        </div>

                        <div className='d-flex flex-wrap gap-2'>
                            <span className='border border-black bg-white rounded-pill px-3 py-2'>HTML5</span>
                            <span className='border border-black bg-white rounded-pill px-3 py-2'>CSS3</span>
                            <span className='border border-black bg-white rounded-pill px-3 py-2'>Bootstrap5</span>
                            <span className='border border-black bg-white rounded-pill px-3 py-2'>JavaScript</span>
                            <span className='border border-black bg-white rounded-pill px-3 py-2'>JSON API Ready</span>
                            <span className='border border-black bg-white rounded-pill px-3 py-2'>LocalStorage</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default About
