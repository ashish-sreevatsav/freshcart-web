import { useState } from 'react';
import { CreditCard, Plus, Trash2, Calendar } from 'lucide-react';
import type { Order } from '@/types';

interface BillingPageProps {
  orders: Order[];
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryDate: string;
  isDefault: boolean;
}

export function BillingPage({ orders }: BillingPageProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'visa', last4: '4242', expiryDate: '12/25', isDefault: true },
    { id: '2', type: 'mastercard', last4: '8888', expiryDate: '09/26', isDefault: false },
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const thisMonthSpent = orders
    .filter(order => {
      const orderDate = new Date(order.date);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, order) => sum + order.total, 0);

  const getCardIcon = (type: PaymentMethod['type']) => {
    return '💳';
  };

  const handleAddCard = () => {
    // Mock adding card
    const last4 = newCard.cardNumber.slice(-4);
    const newMethod: PaymentMethod = {
      id: String(paymentMethods.length + 1),
      type: 'visa',
      last4,
      expiryDate: newCard.expiryDate,
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddCard(false);
    setNewCard({ cardNumber: '', expiryDate: '', cvv: '', name: '' });
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1>Billing & Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your payment methods and view spending</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Total Spent */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white">
          <p className="text-green-100 text-sm mb-2">Total Spent</p>
          <h2 className="text-white mb-4">${totalSpent.toFixed(2)}</h2>
          <p className="text-xs text-green-100">Across {orders.length} orders</p>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <p className="text-blue-100 text-sm mb-2">This Month</p>
          <h2 className="text-white mb-4">${thisMonthSpent.toFixed(2)}</h2>
          <p className="text-xs text-blue-100">Current month spending</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2>Payment Methods</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your saved cards</p>
          </div>
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Card</span>
          </button>
        </div>

        {showAddCard && (
          <div className="p-6 border-b bg-gray-50">
            <h3 className="mb-4">Add New Card</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={newCard.expiryDate}
                    onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  disabled={!newCard.cardNumber || !newCard.expiryDate || !newCard.cvv || !newCard.name}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No payment methods added</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`p-4 border-2 rounded-xl transition-colors ${
                    method.isDefault ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {getCardIcon(method.type)}
                      </div>
                      <div>
                        <p className="text-gray-900">
                          •••• •••• •••• {method.last4}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">Expires {method.expiryDate}</p>
                        </div>
                        {method.isDefault && (
                          <span className="inline-block mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCard(method.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2>Recent Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">Your payment history</p>
        </div>
        <div className="divide-y">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Order {order.id}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-900">${order.total.toFixed(2)}</p>
                <p className="text-xs text-green-600">Paid</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
