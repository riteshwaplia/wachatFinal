import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [allInvestments, setAllInvestments] = useState([]);
  const [products, setProducts] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    // Mock users data
    const mockUsers = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', joinDate: '2023-01-15', balance: 2450.75, status: 'Active' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', joinDate: '2023-02-22', balance: 1875.50, status: 'Active' },
      { id: 3, name: 'Carol Williams', email: 'carol@example.com', joinDate: '2023-03-10', balance: 3250.00, status: 'Active' },
      { id: 4, name: 'David Brown', email: 'david@example.com', joinDate: '2023-04-05', balance: 1200.00, status: 'Inactive' },
      { id: 5, name: 'Eva Davis', email: 'eva@example.com', joinDate: '2023-05-18', balance: 4500.25, status: 'Active' },
    ];

    // Mock investments data
    const mockInvestments = [
      { id: 1, userId: 1, productId: 1, productName: 'Tech Growth Fund', amount: 1000, date: '2023-06-10', status: 'Active' },
      { id: 2, userId: 1, productId: 2, productName: 'Green Energy Portfolio', amount: 500, date: '2023-07-15', status: 'Active' },
      { id: 3, userId: 2, productId: 3, productName: 'Cryptocurrency Basket', amount: 1500, date: '2023-06-22', status: 'Active' },
      { id: 4, userId: 3, productId: 1, productName: 'Tech Growth Fund', amount: 2000, date: '2023-08-01', status: 'Active' },
      { id: 5, userId: 3, productId: 4, productName: 'Real Estate Trust', amount: 1000, date: '2023-08-05', status: 'Active' },
      { id: 6, userId: 4, productId: 6, productName: 'Government Bonds', amount: 800, date: '2023-07-10', status: 'Inactive' },
      { id: 7, userId: 5, productId: 5, productName: 'Startup Venture Fund', amount: 3000, date: '2023-08-12', status: 'Active' },
    ];

    // Mock products data
    const mockProducts = [
      {
        id: 1,
        name: "Tech Growth Fund",
        description: "Invest in top technology companies with high growth potential",
        interestRate: 12.5,
        minInvestment: 100,
        riskLevel: "Medium",
        duration: "12 months",
        totalInvestments: 15,
        totalAmount: 24500,
        status: "Active"
      },
      {
        id: 2,
        name: "Green Energy Portfolio",
        description: "Sustainable energy companies with government backing",
        interestRate: 9.2,
        minInvestment: 50,
        riskLevel: "Low",
        duration: "24 months",
        totalInvestments: 22,
        totalAmount: 18750,
        status: "Active"
      },
      {
        id: 3,
        name: "Cryptocurrency Basket",
        description: "Diversified cryptocurrency investment with managed risk",
        interestRate: 18.7,
        minInvestment: 200,
        riskLevel: "High",
        duration: "6 months",
        totalInvestments: 8,
        totalAmount: 12500,
        status: "Active"
      },
      {
        id: 4,
        name: "Real Estate Trust",
        description: "Commercial real estate properties in growing markets",
        interestRate: 7.8,
        minInvestment: 500,
        riskLevel: "Low",
        duration: "36 months",
        totalInvestments: 12,
        totalAmount: 32500,
        status: "Active"
      },
      {
        id: 5,
        name: "Startup Venture Fund",
        description: "Early-stage startups with disruptive technology",
        interestRate: 22.4,
        minInvestment: 1000,
        riskLevel: "High",
        duration: "48 months",
        totalInvestments: 5,
        totalAmount: 15000,
        status: "Active"
      },
      {
        id: 6,
        name: "Government Bonds",
        description: "Secure government bonds with guaranteed returns",
        interestRate: 5.5,
        minInvestment: 100,
        riskLevel: "Very Low",
        duration: "12 months",
        totalInvestments: 18,
        totalAmount: 22000,
        status: "Active"
      }
    ];

    setUsers(mockUsers);
    setAllInvestments(mockInvestments);
    setProducts(mockProducts);
  }, []);

  // Calculate metrics for dashboard
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'Active').length;
  const totalInvestments = allInvestments.length;
  const totalInvestmentValue = allInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeInvestments = allInvestments.filter(inv => inv.status === 'Active').length;

  // Mock monthly user growth data
  const monthlyUserGrowth = [
    { month: 'Jan', users: 15 },
    { month: 'Feb', users: 28 },
    { month: 'Mar', users: 42 },
    { month: 'Apr', users: 55 },
    { month: 'May', users: 68 },
    { month: 'Jun', users: 82 },
    { month: 'Jul', users: 95 },
    { month: 'Aug', users: 112 }
  ];

  // Find max value for chart scaling
  const maxUsers = Math.max(...monthlyUserGrowth.map(item => item.users));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-indigo-800 text-white min-h-screen">
          <div className="p-5">
            <h1 className="text-2xl font-bold">EarnWell Admin</h1>
            <p className="text-indigo-200 text-sm">Investment Platform Dashboard</p>
          </div>
          <nav className="mt-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left py-3 px-6 flex items-center ${activeTab === 'overview' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full text-left py-3 px-6 flex items-center ${activeTab === 'users' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </button>
            <button 
              onClick={() => setActiveTab('investments')}
              className={`w-full text-left py-3 px-6 flex items-center ${activeTab === 'investments' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Investments
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full text-left py-3 px-6 flex items-center ${activeTab === 'products' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Investment Products
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`w-full text-left py-3 px-6 flex items-center ${activeTab === 'transactions' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Transactions
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left py-3 px-6 flex items-center ${activeTab === 'analytics' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your investment platform</p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-indigo-800">{totalUsers}</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">{activeUsers} active users</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Investments</p>
                      <p className="text-3xl font-bold text-indigo-800">{totalInvestments}</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">{activeInvestments} active investments</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Investment Value</p>
                      <p className="text-3xl font-bold text-indigo-800">${totalInvestmentValue.toLocaleString()}</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">+12.5% from last month</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Investment Products</p>
                      <p className="text-3xl font-bold text-indigo-800">{products.length}</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">All products active</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Investments</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allInvestments.slice(0, 5).map(investment => (
                          <tr key={investment.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {users.find(u => u.id === investment.userId)?.name}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{investment.productName}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${investment.amount}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{investment.date}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Investment Products</h2>
                  <div className="space-y-4">
                    {products.sort((a, b) => b.totalInvestments - a.totalInvestments).slice(0, 3).map(product => (
                      <div key={product.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.totalInvestments} investments</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{product.interestRate}%</p>
                          <p className="text-sm text-gray-600">${product.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                <p className="text-gray-600">Manage all platform users</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-800 font-medium">{user.name.charAt(0)}</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.joinDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${user.balance.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Investments Tab */}
          {activeTab === 'investments' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">All Investments</h2>
                <p className="text-gray-600">View and manage all user investments</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allInvestments.map(investment => (
                      <tr key={investment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {users.find(u => u.id === investment.userId)?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{investment.productName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${investment.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{investment.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${investment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {investment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                          <button className="text-red-600 hover:text-red-900">Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Investment Products</h2>
                    <p className="text-gray-600">Manage available investment options</p>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Add New Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest Rate
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Minimum Investment
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk Level
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Invested
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map(product => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-green-600 font-medium">{product.interestRate}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${product.minInvestment}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${product.riskLevel === 'Very Low' ? 'bg-green-100 text-green-800' : 
                                product.riskLevel === 'Low' ? 'bg-blue-100 text-blue-800' :
                                product.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                              {product.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${product.totalAmount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{product.totalInvestments} investments</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Deactivate</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
    )}
export default AdminDashboard;