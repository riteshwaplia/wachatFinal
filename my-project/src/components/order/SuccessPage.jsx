// src/components/SuccessPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import api from "../../utils/api";
import { getOrderDetails } from "../../apis/Order";

const SuccessPage = () => {
  const { orderId,projectId } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const razorpay_payment_id = searchParams.get("razorpay_payment_id");
console.log("rezorpay_payment_id", razorpay_payment_id);
  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        // ✅ Step 1: Verify payment
        if (razorpay_payment_id) {
          await api.post(`/projects/${projectId}/orders/${orderId}/verify`, {
            orderId,
            razorpay_payment_id,
          });
        }

        // ✅ Step 2: Fetch updated order
        const res = await getOrderDetails(projectId,orderId);
        console.log("dta", res);
        setOrder(res);
      } catch (err) {
        console.error("Error verifying/fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [orderId, razorpay_payment_id]);

  if (loading) return <p className="text-center mt-10">Loading your order...</p>;
  if (!order) return <p className="text-center mt-10">Order not found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-lg rounded-lg p-6 text-center">
      {order.paymentStatus === "paid" ? (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order{" "}
            <span className="font-semibold">{order.orderNumber}</span>. Your
            payment has been confirmed.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            ❌ Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            Unfortunately, we could not confirm your payment for order{" "}
            <span className="font-semibold">{order.orderNumber}</span>.
          </p>
        </>
      )}

      {/* Order Items */}
      <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
      {order.items?.length ? (
        <ul className="mb-6 border rounded-md divide-y">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between p-3">
              <span>
                {item.productRetailerId} (x{item.quantity})
              </span>
              <span>
                {item.itemPrice} {item.currency}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">No items found in this order.</p>
      )}

      <p className="font-bold text-lg mb-6">
        Total: {order.total} {order.currency}
      </p>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="bg-gray-50 border rounded-md p-4 mb-6 text-left">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
 {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}

        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Back to Home
        </Link>
        <Link
          to="/orders"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-300"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
