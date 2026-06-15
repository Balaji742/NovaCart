import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const loginHandler = async () => {
        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            )
            toast.success("login successful")
            navigate("/homepage")
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div>
            <div className="card shadow-sm mx-auto" style={{ maxWidth: "1000px", minHeight: "50px"}}>
                <div className="row g-0">

                    <div className="col-lg-6 position-relative image-container">
                        <img
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=80"
                            alt=""
                            className="h-100 w-100"
                            style={{ objectFit: "cover" }}
                        />
                        <div className='overlay-text'>
                            <h6 className='text-info fw-bolder'>WELCOME BACK</h6>
                            <h6 className='fw-bold fs-4 text-white'>Access your cart and<br />continue shopping faster.</h6>
                            <small className='text-white'>Your demo account stored locally in this browser for<br />portfolio and learning use.</small>
                        </div>
                    </div>

                    <div className="col-lg-6 p-5">
                        <h2 className='pt-5'>Login</h2>
                        <small className='text-muted'>Enter your registered email and password</small><br />
                        <label className='fw-bolder mb-1 pt-4'>Email address</label>
                        <input type="email" className="form-control p-2 mb-3 w-100" onChange={(e) => setEmail(e.target.value)} />
                        <label className='fw-bolder mb-1'>Passsword</label>
                        <input type="password" className="form-control p-2 w-100" onChange={(e) =>setPassword(e.target.value)} />
                        <div className='form-check mb-2 mt-3'>
                            <input type='checkbox' className='form-check-input' />
                            <label className='ms-1 form-check-label'>Remember me</label>

                        </div>
                        <button className="btn btn-dark w-100 mt-3" onClick={loginHandler}>Login</button>
                        <p className='mt-4 text-center '>Don't have account?<Link to="/registerpage" cl>Register</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login