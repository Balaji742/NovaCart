import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
    const [agree, setAgree] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate();

    const registerHandler = async () => {
        try {
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            await setDoc(
                doc(db, "users", userCredential.user.uid),
                {
                    uid: userCredential.user.uid,
                    name,
                    email,
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    pincode: ""
                }
            );

            toast.success("Registration successful");
            navigate("/loginpage");
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <div className="card shadow-sm mx-auto" style={{ maxWidth: "900px", height: "650px", overflow: "hidden" }}>
                <div className="row g-0 h-100">

                    <div className="col-lg-6 position-relative image-container">
                        <img
                            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1100&q=80"
                            alt=""
                            className="h-100 w-100"
                            style={{ objectFit: "cover" }}
                        />
                        <div className='ms-4 overlay-text' style={{ bottom: "40px", left: "30px", right: "30px" }}>
                            <h6 className='text-info fw-bolder'>Join NovaCart</h6>
                            <h6 className='fw-bold fs-4 text-white'>Create an account with<br />practical validation and<br />secure local hashing.</h6>
                            <small className='text-white'>This front-end demo uses browser storage, suitable for<br />showcasing UI and JavaScript flow.</small>
                        </div>
                    </div>

                    <div className="col-lg-6 p-5">
                        <h2>Create Account</h2>
                        <small className='text-muted'>Use strong password to register.</small><br />
                        <label className='fw-bolder mb-1 mt-2'>Full name</label>
                        <input type="text" className="form-control mb-3 w-100" value={name}
                            onChange={(e) => setName(e.target.value)} />
                        <label className='fw-bolder mb-1'>Email address</label>
                        <input type="email" className="form-control mb-3 w-100" onChange={(e) => setEmail(e.target.value)} />
                        <label className='fw-bolder mb-1'>Passsword</label>
                        <input type="password" className="form-control w-100" onChange={(e) => setPassword(e.target.value)} />
                        <small className='text-muted '>Minimum 8 characters with uppercase, lowercase, number and symbol</small><br></br>
                        <label className='fw-bolder mb-1 mt-'>Confirm password</label>
                        <input type="password" className="form-control mb-3 w-100" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                        {
                            confirmPassword && password !== confirmPassword && (
                                <small className='text-danger'>Password do not match</small>
                            )
                        }
                        <div className='form-check mb-3'>
                            <input type='checkbox' id='terms' className='form-check-input' checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                            <label className='ms-1 form-check-label' htmlFor='terms'>l agree to the NovaCart account terms</label>

                        </div>
                        <button className="btn btn-dark w-100" disabled={!agree || password !== confirmPassword} onClick={registerHandler}> Create Account</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register