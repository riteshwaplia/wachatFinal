// src/components/OrderDashboard.jsx
import React, { useState, useEffect } from 'react';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import PaymentPage from './PaymentPage';
import { getOrders, getOrderDetails } from '../services/api';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'details', 'payment'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = async (orderId) => {
    try {
      setLoading(true);
      const orderDetails = await getOrderDetails(orderId);
      setSelectedOrder(orderDetails);
      setView('details');
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (order) => {
    setSelectedOrder(order);
    setView('payment');
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setView('list');
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
          onBack={() => setView('details')}
          onSuccess={() => {
            setView('list');
            fetchOrders(); // Refresh orders list
          }}
        />
      )}
    </div>
  );
};

export default OrderDashboard;