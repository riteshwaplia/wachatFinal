// src/components/PaymentForm.jsx
import React from "react";

const PaymentForm = ({ order, onSubmit, loading, onBack }) => {
  return (
    <div>
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-800">Order Total</h3>
          <span className="text-lg font-bold">
            {order.currency} {order.total.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md shadow-sm"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md shadow-sm disabled:opacity-50"
        >
          {loading ? "Redirecting..." : `Pay ${order.currency} ${order.total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
