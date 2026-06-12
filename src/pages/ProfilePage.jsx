import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", photoURL: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const uid = auth.currentUser?.uid;
                if (!uid) return;
                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                    setPreview(docSnap.data().photoURL || null);
                }
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const saveHandler = async () => {
        setSaving(true);
        try {
            const uid = auth.currentUser?.uid;
            let photoURL = profile.photoURL || "";

            if (imageFile) {
                // Resize image before converting to base64
                photoURL = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement("canvas");
                            canvas.width = 150;
                            canvas.height = 150;
                            const ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, 150, 150);
                            resolve(canvas.toDataURL("image/jpeg", 0.5)); // compressed
                        };
                        img.src = reader.result;
                    };
                    reader.readAsDataURL(imageFile);
                });
            }

            const { photoURL: _, ...rest } = profile;
            await updateDoc(doc(db, "users", uid), {
                ...rest,
                photoURL
            });

            setProfile(prev => ({ ...prev, photoURL }));
            setPreview(photoURL);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.message); // show actual error
        } finally {
            setSaving(false);
        }
    };
    if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

    return (
        <div className="container my-5">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
                <div className="card-body p-5">
                    <h3 className="fw-bold mb-4">My Profile</h3>

                    {/* Profile Picture */}
                    <div className="text-center mb-4">
                        <img
                            src={preview || "https://ui-avatars.com/api/?name=" + profile.name + "&background=000&color=fff&size=128"}
                            alt="profile"
                            className="rounded-circle mb-3"
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        />
                        <div>
                            <label className="btn btn-outline-dark btn-sm">
                                Change Photo
                                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="fw-bold mb-1">Full Name</label>
                            <input type="text" className="form-control" value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold mb-1">Email</label>
                            <input type="email" className="form-control" value={profile.email} disabled />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold mb-1">Phone</label>
                            <input type="text" className="form-control" value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold mb-1">City</label>
                            <input type="text" className="form-control" value={profile.city}
                                onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                        </div>
                        <div className="col-12">
                            <label className="fw-bold mb-1">Address</label>
                            <input type="text" className="form-control" value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold mb-1">State</label>
                            <input type="text" className="form-control" value={profile.state}
                                onChange={(e) => setProfile({ ...profile, state: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold mb-1">Pincode</label>
                            <input type="text" className="form-control" value={profile.pincode}
                                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })} />
                        </div>
                    </div>

                    <button className="btn btn-dark w-100 mt-4" onClick={saveHandler} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;