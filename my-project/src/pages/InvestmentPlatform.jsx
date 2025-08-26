import React, { useState, useEffect } from 'react';

const InvestmentPlatform = () => {
  const [walletBalance, setWalletBalance] = useState(1000);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [investmentProducts, setInvestmentProducts] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [activeTab, setActiveTab] = useState('marketplace');

  // Sample investment products
  useEffect(() => {
    const products = [
      {
        id: 1,
        name: "Tech Growth Fund",
        description: "Invest in top technology companies with high growth potential",
        interestRate: 12.5,
        minInvestment: 100,
        riskLevel: "Medium",
        duration: "12 months"
      },
      {
        id: 2,
        name: "Green Energy Portfolio",
        description: "Sustainable energy companies with government backing",
        interestRate: 9.2,
        minInvestment: 50,
        riskLevel: "Low",
        duration: "24 months"
      },
      {
        id: 3,
        name: "Cryptocurrency Basket",
        description: "Diversified cryptocurrency investment with managed risk",
        interestRate: 18.7,
        minInvestment: 200,
        riskLevel: "High",
        duration: "6 months"
      },
      {
        id: 4,
        name: "Real Estate Trust",
        description: "Commercial real estate properties in growing markets",
        interestRate: 7.8,
        minInvestment: 500,
        riskLevel: "Low",
        duration: "36 months"
      },
      {
        id: 5,
        name: "Startup Venture Fund",
        description: "Early-stage startups with disruptive technology",
        interestRate: 22.4,
        minInvestment: 1000,
        riskLevel: "High",
        duration: "48 months"
      },
      {
        id: 6,
        name: "Government Bonds",
        description: "Secure government bonds with guaranteed returns",
        interestRate: 5.5,
        minInvestment: 100,
        riskLevel: "Very Low",
        duration: "12 months"
      }
    ];
    setInvestmentProducts(products);
    
    // Load user investments from localStorage if available
    const savedInvestments = localStorage.getItem('userInvestments');
    if (savedInvestments) {
      setUserInvestments(JSON.parse(savedInvestments));
    }
  }, []);

  // Save investments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userInvestments', JSON.stringify(userInvestments));
  }, [userInvestments]);

  const handleAddFunds = (amount) => {
    setWalletBalance(prev => prev + amount);
    setShowUPIModal(false);
  };

  const handleInvest = (productId, amount) => {
    const product = investmentProducts.find(p => p.id === productId);
    if (walletBalance >= amount && amount >= product.minInvestment) {
      setWalletBalance(prev => prev - amount);
      
      const investment = {
        id: Date.now(),
        productId,
        productName: product.name,
        amount,
        date: new Date().toLocaleDateString(),
        interestRate: product.interestRate,
        maturityDate: calculateMaturityDate(product.duration)
      };
      
      setUserInvestments(prev => [...prev, investment]);
      alert(`Successfully invested $${amount} in ${product.name}`);
    } else {
      alert(`Investment failed. Either insufficient funds or amount below minimum investment of $${product.minInvestment}`);
    }
  };

  const calculateMaturityDate = (duration) => {
    const months = parseInt(duration);
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString();
  };

  const calculateReturns = (investment) => {
    const principal = investment.amount;
    const interest = principal * (investment.interestRate / 100);
    return interest.toFixed(2);
  };

  const totalInvested = userInvestments.reduce((total, inv) => total + inv.amount, 0);
  const totalReturns = userInvestments.reduce((total, inv) => total + parseFloat(calculateReturns(inv)), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-indigo-800">EarnWell Investments</h1>
              <p className="text-gray-600 mt-2">Grow your money with smart investments</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-indigo-100 rounded-lg p-4 flex items-center">
                <div className="mr-4">
                  <p className="text-sm text-indigo-700">Wallet Balance</p>
                  <p className="text-2xl font-bold text-indigo-800">${walletBalance.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => setShowUPIModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            <button 
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'marketplace' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('marketplace')}
            >
              Investment Marketplace
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'myinvestments' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('myinvestments')}
            >
              My Investments
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'performance' ? 'bg-indigo-100 text-indigo-800' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
          </div>
        </div>

        {/* Main Content based on active tab */}
        {activeTab === 'marketplace' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Investment Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentProducts.map(product => (
                <InvestmentCard 
                  key={product.id} 
                  product={product} 
                  onInvest={handleInvest} 
                  walletBalance={walletBalance}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'myinvestments' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Investment Portfolio</h2>
            {userInvestments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600 mb-4">You haven't made any investments yet.</p>
                <button 
                  onClick={() => setActiveTab('marketplace')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Browse Investments
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Investment
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interest Rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invested On
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Maturity Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expected Returns
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userInvestments.map(investment => (
                      <tr key={investment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{investment.productName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${investment.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{investment.interestRate}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{investment.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{investment.maturityDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${calculateReturns(investment)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-600">Total Invested</p>
                <p className="text-3xl font-bold text-indigo-800">${totalInvested.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-600">Expected Annual Returns</p>
                <p className="text-3xl font-bold text-green-600">${totalReturns.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-600">Number of Investments</p>
                <p className="text-3xl font-bold text-purple-600">{userInvestments.length}</p>
              </div>
            </div>
            
            {userInvestments.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Returns Breakdown</h3>
                <div className="space-y-4">
                  {userInvestments.map(investment => (
                    <div key={investment.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <p className="font-medium">{investment.productName}</p>
                        <p className="text-sm text-gray-600">Invested: ${investment.amount} @ {investment.interestRate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">${calculateReturns(investment)}</p>
                        <p className="text-sm text-gray-600">annual returns</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* UPI Payment Modal */}
        {showUPIModal && (
          <UPIModal 
            onClose={() => setShowUPIModal(false)} 
            onAddFunds={handleAddFunds} 
          />
        )}
      </div>
    </div>
  );
};

const InvestmentCard = ({ product, onInvest, walletBalance }) => {
  const [investmentAmount, setInvestmentAmount] = useState(product.minInvestment);

  const handleInvestClick = () => {
    onInvest(product.id, parseFloat(investmentAmount));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 mt-1">{product.description}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium
            ${product.riskLevel === 'Very Low' ? 'bg-green-100 text-green-800' : 
              product.riskLevel === 'Low' ? 'bg-blue-100 text-blue-800' :
              product.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}`}
          >
            {product.riskLevel} Risk
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Interest Rate</p>
            <p className="text-2xl font-bold text-green-600">{product.interestRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Minimum Investment</p>
            <p className="text-lg font-semibold text-gray-800">${product.minInvestment}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-lg font-semibold text-gray-800">{product.duration}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor={`amount-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Investment Amount
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              $
            </span>
            <input
              type="number"
              id={`amount-${product.id}`}
              min={product.minInvestment}
              max={walletBalance}
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <button 
          onClick={handleInvestClick}
          disabled={walletBalance < product.minInvestment}
          className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition-colors
            ${walletBalance >= product.minInvestment 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {walletBalance >= product.minInvestment ? 'Invest Now' : 'Insufficient Funds'}
        </button>
      </div>
    </div>
  );
};

const UPIModal = ({ onClose, onAddFunds }) => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !upiId) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onAddFunds(parseFloat(amount));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Funds via UPI</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Add ($)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
              UPI ID
            </label>
            <input
              type="text"
              id="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="yourname@upi"
              required
            />
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Simulated UPI Payment</p>
            <p className="text-sm text-gray-600">In a real application, this would redirect to your UPI app for payment</p>
          </div>
          
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {isProcessing ? 'Processing Payment...' : 'Add Funds'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvestmentPlatform;