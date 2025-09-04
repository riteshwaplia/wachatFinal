// src/components/OrderDetails.jsx
import React from 'react';

const OrderDetails = ({ order, onBack, onPayment }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const paymentColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentColors[paymentStatus] || 'bg-gray-100 text-gray-800'}`}>
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Orders
        </button>
      </div>
      
      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Order Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Order Number:</span> #{order.orderNumber}</p>
            <p><span className="font-medium">Order Date:</span> {formatDate(order.createdAt)}</p>
            <p><span className="font-medium">Status:</span> {getStatusBadge(order.status)}</p>
            <p><span className="font-medium">Payment Status:</span> {getPaymentBadge(order.paymentStatus)}</p>
            <p><span className="font-medium">Total Amount:</span> {order.currency} {order.total.toFixed(2)}</p>
          </div>
        </div>
        
        {order.shippingAddress && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Shipping Address</h3>
            <div className="space-y-2">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.image && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.name} />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.productId && (
                          <div className="text-sm text-gray-500">SKU: {item.productId}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.currency} {item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.currency} {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                  Subtotal
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.currency} {order.subtotal.toFixed(2)}
                </td>
              </tr>
              {order.tax > 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    Tax
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.currency} {order.tax.toFixed(2)}
                  </td>
                </tr>
              )}
              {order.shipping > 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    Shipping
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.currency} {order.shipping.toFixed(2)}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                  Total
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {order.currency} {order.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {order.paymentStatus === 'pending' && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={() => onPayment(order)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md shadow-sm"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;