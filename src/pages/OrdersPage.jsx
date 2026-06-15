import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { IoIosStar } from "react-icons/io";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState(null);
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
                          <img src={item.image} alt="" style={{maxWidth:"80px"}} className='rounded-2 img-fluid me-4' />
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
                  <div
                    className="position-fixed bg-white shadow p-4 rounded"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "900px",
                      maxHeight: "80vh",
                      overflowY: "auto",
                      zIndex: 9999
                    }}
                  >
                    <button
                      className="btn-close float-end"
                      onClick={() => setView(null)}
                    ></button>

                    <h4 className="mb-4">Order Details</h4>

                    <div className="row">
                      {view.items.map((prod, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                          <div className="card">
                            <img src={prod.image} alt={prod.title} />

                            <div className="d-flex justify-content-between me-3 ms-3 mt-3">
                              <h6 className="border border-1 p-1 fs-6 rounded-5 bg-success-subtle text-success fw-bold">
                                {prod.category}
                              </h6>

                              <h6 className="text-warning">
                                <IoIosStar className="text-warning mb-1" />
                                {prod.rating}
                              </h6>
                            </div>

                            <h6 className="fw-bold me-3 ms-3 mt-1 fs-6">
                              {prod.name}
                            </h6>

                            <p className="me-3 ms-3 mt-4 text-light-emphasis">
                              {prod.description}
                            </p>

                            <div className="d-flex justify-content-between me-3 ms-3 mt-2">
                              <h5 className="fw-bold">
                                ${prod.price}
                              </h5>

                              <span className="badge bg-dark align-self-center">
                                Qty: {prod.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
