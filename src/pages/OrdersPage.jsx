import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { IoIosStar } from "react-icons/io";
// import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState(null);
  // const navigate = useNavigate()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getOrders(user.uid)
      }
    })
    return () => unsubscribe()
  }, [])

  const getOrders = async () => {
    const q = query(collection(db, "orders"), where("userId", "==", auth.currentUser.uid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(data);
  }
  const cancelOrder = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders((prev) => prev.filter((order) => order.id !== id))

      alert("Order has been cancelled")
    } catch (error) {
      console.log(error)
    }
  }

  // navigate(`/orders/${order.id}`);

  return (
    <div className='container mt-'>
      <h2 className='text-center'>My orders</h2>
      <h4 className='alert alert-primary'>Total Orders: {orders.length}</h4>
      {
        orders.map(order => {
          const subTotal = (order.items || []).reduce((acc, item) => acc + item.price * item.quantity, 0);
          const shipping = 8.50;
          const total = subTotal + shipping;
          return (
            <div key={order.id}>
              <div className='card p-3 mb-3'>
                <p>Order ID: {order.id}</p>
                <h5>Status: Processing</h5>
                <h5>
                  Date: {
                    order.createdAt
                      ? order.createdAt.toDate().toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "N/A"
                  }
                </h5><hr />
                {
                  order.items?.map((item, i) => (
                    <div key={i}>
                      <div>
                        <div className='d-flex m-2'>
                          <img src={item.image} alt="" style={{ maxWidth: "80px" }} className='rounded-2 img-fluid me-4' />
                          <h5 className='mt-2 me-5'>{item.name}</h5>
                          <h5 className='mt-2'>Qty: {item.quantity}</h5>
                        </div>
                        <h6 className='ms-5 ps-5'>Price: ${item.price * item.quantity}</h6>
                      </div>

                    </div>
                  ))
                }<hr />
                <div className=''>
                  <div className='d-flex justify-content-between'>
                    <span>SubTotal:</span>
                    <span className="fw-bold">${subTotal.toFixed(2)}</span>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <span>Shipping:</span>
                    <span className="fw-bold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <span>Total:</span>
                    <span className="fw-bold">${total.toFixed(2)}</span>
                  </div>
                </div><hr />
                <div className='text-end'>
                  <button className='btn btn-success  me-2' onClick={() => setView(order)}>View Details</button>
                  <button className='btn btn-danger ' onClick={() => cancelOrder(order.id)}>Cancel Order</button>
                </div>
              </div>
              {
                view && (
                  <>
                    {/* Overlay */}
                    <div
                      onClick={() => setView(null)}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.6)",
                        zIndex: 9998
                      }}
                    />

                    {/* Modal */}
                    <div
                      className="bg-white shadow rounded"
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "95%",
                        maxWidth: "1000px",
                        maxHeight: "85vh",
                        overflowY: "auto",
                        zIndex: 9999,
                        padding: "20px"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h4 className="mb-0">Order Details</h4>

                        <button
                          className="btn-close"
                          onClick={() => setView(null)}
                        />
                      </div>

                      <div className="row">
                        {view.items.map((prod, i) => (
                          <div className="col-12 col-md-6 col-lg-4 mb-3" key={i}>
                            <div className="card h-100 shadow-sm">

                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="card-img-top"
                                style={{
                                  height: "180px",
                                  objectFit: "cover"
                                }}
                              />

                              <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="badge bg-success">
                                    {prod.category}
                                  </span>

                                  <span className="text-warning fw-bold">
                                    <IoIosStar />
                                    {" "}
                                    {prod.rating}
                                  </span>
                                </div>

                                <h6 className="fw-bold">
                                  {prod.name}
                                </h6>

                                <p
                                  className="text-muted small"            
                                  style={{
                                    minHeight: "60px"
                                  }}
                                >
                                  {prod.description}
                                </p>

                                <div className="d-flex justify-content-between align-items-center mt-3">
                                  <h5 className="fw-bold mb-0">
                                    ${prod.price}
                                  </h5>

                                  <span className="badge bg-dark">
                                    Qty: {prod.quantity}
                                  </span>
                                </div>

                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default OrdersPage
