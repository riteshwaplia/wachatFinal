// src/components/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import {
  getOrderDetails,
  updateOrderAddress,
  generatePaymentLink,
} from "../../apis/Order";

const PaymentPage = () => {
  const { projectId, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState("address");
  const [loading, setLoading] = useState(true);
console.log("params", projectId, orderId);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderDetails(projectId, orderId);
        setOrder(orderData);
        if (orderData.shippingAddress) setStep("payment");
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [projectId, orderId]);
const handlePayment = async (e) => {
  e.preventDefault();
  try {
    const res = await generatePaymentLink(projectId, orderId);
    if (res?.url) {
      window.location.href = res.url;
    } else {
      console.error("No payment URL returned:", res);
    }
  } catch (err) {
    console.error("Payment link error:", err);
  }
};

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <ul className="mb-6">
        {order.items.map((item, idx) => (
          <li key={idx} className="flex justify-between py-2 border-b">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>
              {item.price} {item.currency}
            </span>
          </li>
        ))}
      </ul>

      {step === "address" ? (
       <AddressForm
  onSubmit={async (addressData) => {
    await updateOrderAddress(projectId, orderId, addressData); // orderId instead of order._id
    setStep("payment");
  }}
  initialData={order.shippingAddress || {}}
/>

      ) : (
        <PaymentForm
  order={order}
    onSubmit={handlePayment}
/>

      )}
    </div>
  );
};

export default PaymentPage;
