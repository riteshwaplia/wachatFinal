// src/components/OrderDashboard.jsx
import React, { useState, useEffect } from 'react';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import PaymentPage from './PaymentPage';
import { getOrderDetails, getOrders } from '../../apis/Order';
import { useParams } from 'react-router-dom';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const {id: projectId} = useParams();
console.log("projectId", projectId);
  useEffect(() => {
    fetchOrders();
  }, [projectId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOrders(projectId);
      console.log("orddcbcers", res);

      setOrders(res.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSelectOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const orderDetails = await getOrderDetails(projectId, orderId);
      setSelectedOrder(orderDetails);
      setView("details");
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (order) => {
    setSelectedOrder(order);
    setView("payment");
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setView("list");
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Order Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={fetchOrders}
            className="ml-4 text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}
      
      {view === 'list' && (
        <OrderList 
          orders={orders} 
          onSelectOrder={handleSelectOrder}
          onPayment={handlePayment}
        />
      )}
      
      {view === 'details' && selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onBack={handleBackToList}
          onPayment={handlePayment}
        />
      )}
      
      {view === 'payment' && selectedOrder && (
        <PaymentPage 
          order={selectedOrder}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default OrderDashboard;