import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { useState } from 'react';
import type { Order, CartItem, BookingDetails } from '@/types';
import { Dropdown } from '@/shared/components/ui/dropdown';
import { CheckoutModal } from '@/features/cart/components/CheckoutModal';

interface OrdersPageProps {
  orders: Order[];
  onAddQuery: (orderId: string, subject: string, category: string, description: string) => void;
  onReorder: (items: Order['items'], bookingDetails: any) => void;
}

export function OrdersPage({ orders, onAddQuery, onReorder }: OrdersPageProps) {
  const [queryOpen, setQueryOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [querySubject, setQuerySubject] = useState('');
  const [queryCategory, setQueryCategory] = useState<'complaint' | 'refund' | 'product-issue' | 'delivery-issue' | 'other'>('complaint');
  const [queryText, setQueryText] = useState('');
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>(null);
  const [isReorderCheckoutOpen, setIsReorderCheckoutOpen] = useState(false);
  const [reorderItems, setReorderItems] = useState<Order['items']>([]);

  const openQuery = (orderId: string) => {
    setSelectedOrderId(orderId);
    setQuerySubject('');
    setQueryCategory('complaint');
    setQueryText('');
    setQueryOpen(true);
  };

  const closeQuery = () => {
    setQueryOpen(false);
    setSelectedOrderId(null);
    setQuerySubject('');
    setQueryCategory('complaint');
    setQueryText('');
  };

  const submitQuery = () => {
    if (selectedOrderId && querySubject.trim() && queryText.trim()) {
      onAddQuery(selectedOrderId, querySubject.trim(), queryCategory, queryText.trim());
      alert('Thanks — our support team will contact you shortly about your query.');
      closeQuery();
    }
  };

  const openViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setViewDetailsOpen(true);
  };

  const closeViewDetails = () => {
    setViewDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleReorder = (orderItems: Order['items']) => {
    setReorderItems(orderItems);
    setIsReorderCheckoutOpen(true);
  };

  const handleCompleteReorder = (bookingDetails: any) => {
    onReorder(reorderItems, bookingDetails);
    setIsReorderCheckoutOpen(false);
    setReorderItems([]);
  };

  const getReorderTotalPrice = () => {
    return reorderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-transit':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in-transit':
        return 'In Transit';
      case 'processing':
        return 'Processing';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700';
      case 'in-transit':
        return 'bg-blue-50 text-blue-700';
      case 'processing':
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1>Order History</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900">Order {order.id}</h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Delivery Date</p>
                    <p className="text-gray-900">
                      {new Date(order.deliveryDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time Slot</p>
                    <p className="text-gray-900">{order.deliveryTime}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500">Delivery Address</p>
                    <p className="text-gray-900">{order.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="text-sm text-gray-500 mb-4">Items ({order.items.length})</h4>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t flex items-center justify-between">
                  <span className="text-gray-900">Total</span>
                  <span className="text-green-600">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t bg-gray-50 flex gap-3">
                <button 
                  onClick={() => openViewDetails(order)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  View Details
                </button>
                {order.status === 'delivered' && (
                  <>
                    <button 
                      onClick={() => handleReorder(order.items)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Reorder
                    </button>
                    <button
                      onClick={() => openQuery(order.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Raise Query
                    </button>
                  </>
                )}
                {order.status === 'in-transit' && (
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Track Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      {viewDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-medium">Order Details - {selectedOrder.id}</h3>
              <p className="text-sm text-gray-500 mt-1">Complete information about your order</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <span className="text-lg font-medium text-green-600">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Raised Queries */}
              {selectedOrder.queries && selectedOrder.queries.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Raised Queries</h4>
                  <div className="space-y-3">
                    {selectedOrder.queries.map(query => (
                      <div key={query.id} className="border rounded-lg bg-gray-50 overflow-hidden">
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => setExpandedQueryId(expandedQueryId === query.id ? null : query.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  query.category === 'complaint' ? 'bg-red-100 text-red-700' :
                                  query.category === 'refund' ? 'bg-purple-100 text-purple-700' :
                                  query.category === 'product-issue' ? 'bg-orange-100 text-orange-700' :
                                  query.category === 'delivery-issue' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {query.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">{query.subject}</p>
                              <p className="text-xs text-gray-500">
                                Created: {new Date(query.createdAt).toLocaleString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {query.resolvedAt && (
                                <p className="text-xs text-gray-500">
                                  Resolved: {new Date(query.resolvedAt).toLocaleString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                query.status === 'resolved' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {query.status === 'resolved' ? 'Resolved' : 'Pending'}
                              </span>
                              <svg 
                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                  expandedQueryId === query.id ? 'rotate-180' : ''
                                }`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        {expandedQueryId === query.id && (
                          <div className="px-4 pb-4 pt-0 border-t bg-white">
                            <p className="text-sm text-gray-700 mt-3">{query.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!selectedOrder.queries || selectedOrder.queries.length === 0) && (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">No queries raised for this order</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end sticky bottom-0">
              <button 
                onClick={closeViewDetails}
                className="px-4 py-2 rounded-lg bg-white border text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raise Query Modal */}
      {queryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">Raise a query for order #{selectedOrderId}</h3>
              <p className="text-sm text-gray-500 mt-1">Our support team will contact you to resolve the issue.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Dropdown
                  options={[
                    { value: 'complaint', label: 'Complaint' },
                    { value: 'refund', label: 'Refund Request' },
                    { value: 'product-issue', label: 'Product Issue' },
                    { value: 'delivery-issue', label: 'Delivery Issue' },
                    { value: 'other', label: 'Other' }
                  ]}
                  value={queryCategory}
                  onChange={(value) => setQueryCategory(value as any)}
                  placeholder="Select a category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={querySubject}
                  onChange={e => setQuerySubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief summary of your issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={queryText}
                  onChange={e => setQueryText(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us what went wrong or what you'd like help with..."
                />
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end">
              <button onClick={closeQuery} className="px-4 py-2 rounded-lg bg-white border text-sm">
                Cancel
              </button>
              <button
                onClick={submitQuery}
                disabled={!querySubject.trim() || !queryText.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                Send Query
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reorder Checkout Modal */}
      {isReorderCheckoutOpen && (
        <CheckoutModal
          items={reorderItems}
          totalPrice={getReorderTotalPrice()}
          onClose={() => {
            setIsReorderCheckoutOpen(false);
            setReorderItems([]);
          }}
          onComplete={handleCompleteReorder}
        />
      )}
    </div>
  );
}
