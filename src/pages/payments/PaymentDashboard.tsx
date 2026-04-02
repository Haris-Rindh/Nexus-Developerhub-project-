import React, { useState } from 'react';
import { CreditCard, Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle2, History, ShieldCheck } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 'tx_1', date: '2023-11-01', amount: 50000, type: 'Deposit', status: 'Completed' },
  { id: 'tx_2', date: '2023-10-28', amount: -2500, type: 'Withdrawal', status: 'Completed' },
  { id: 'tx_3', date: '2023-10-15', amount: 150000, type: 'Transfer', status: 'Pending' },
];

const PaymentDashboard: React.FC = () => {
  const [balance, setBalance] = useState(250000);
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || isNaN(Number(depositAmount))) return;

    setIsProcessing(true);
    
    setTimeout(() => {
      setBalance(prev => prev + Number(depositAmount));
      setIsProcessing(false);
      setShowSuccess(true);
      setDepositAmount('');
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center space-x-3">
          <Wallet className="w-10 h-10 text-blue-600" />
          <span>Financial Dashboard</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage your funds, deposits, and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-blue-200/80 font-medium tracking-wide uppercase text-sm mb-1">Available Balance</p>
              <h2 className="text-5xl font-bold tracking-tighter mb-8">
                ${balance.toLocaleString()}
              </h2>
              
              <div className="flex space-x-4">
                <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors py-3 rounded-xl flex items-center justify-center space-x-2 font-semibold">
                  <ArrowDownLeft className="w-5 h-5" />
                  <span>Deposit</span>
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors py-3 rounded-xl flex items-center justify-center space-x-2 font-semibold">
                  <ArrowUpRight className="w-5 h-5" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center space-x-2 mb-6">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <span>Make a Deposit</span>
            </h3>
            
            <form onSubmit={handleDeposit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input 
                    type="number"
                    required
                    min="1"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    placeholder="10,000"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 -mb-1">Card Details</label>
                <input 
                  type="text" 
                  placeholder="Card Number (Mock)" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="CVC" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : showSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> <span>Success!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" /> <span>Deposit Funds</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden h-full">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center space-x-2">
                <History className="w-5 h-5 text-gray-500" />
                <span>Transaction History</span>
              </h3>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Date</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Type</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="py-4 px-6 font-semibold text-sm text-gray-500 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {MOCK_TRANSACTIONS.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {tx.type}
                      </td>
                      <td className={`py-4 px-6 text-sm font-bold ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          tx.status === 'Completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {[1,2,3].map(i => (
                    <tr key={i} className="opacity-0 lg:opacity-100 pointer-events-none">
                      <td className="py-6"><div className="h-4"></div></td>
                      <td></td><td></td><td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;
