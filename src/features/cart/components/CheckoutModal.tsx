import { useState } from 'react';
import { X, Calendar, Clock, MapPin, CreditCard, Check, Plus, Home, Briefcase, MoreHorizontal } from 'lucide-react';
import type { CartItem, Address, AddressCategory, PaymentMethod, PaymentMethodType } from '@/types';
import { CalendarPicker } from '@/shared/components/ui/calendar-picker';
import { Dropdown } from '@/shared/components/ui/dropdown';
import { useUserProfile } from '@/features/profile';

interface CheckoutModalProps {
  items: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onComplete: (bookingDetails: any) => void;
}

export function CheckoutModal({ items, totalPrice, onClose, onComplete }: CheckoutModalProps) {
  const { 
    addresses, 
    defaultAddress, 
    addAddress, 
    paymentMethods, 
    defaultPaymentMethod, 
    addPaymentMethod 
  } = useUserProfile();
  
  const [step, setStep] = useState(0);
  const [deliveryType, setDeliveryType] = useState<'instant' | 'scheduled' | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(defaultAddress);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(defaultPaymentMethod);
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [saveNewPayment, setSaveNewPayment] = useState(true);
  
  const [formData, setFormData] = useState({
    deliveryDate: '',
    deliveryTime: '',
  });
  
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    category: 'home',
    isDefault: false,
  });
  
  const [newPayment, setNewPayment] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    type: 'visa' as PaymentMethodType,
  });
  
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save new address if checkbox is selected
    if (showNewAddress && saveNewAddress) {
      addAddress(newAddress);
    }
    
    // Save new payment if checkbox is selected
    if (showNewPayment && saveNewPayment) {
      const last4 = newPayment.cardNumber.slice(-4);
      addPaymentMethod({
        type: newPayment.type,
        cardholderName: newPayment.cardholderName,
        last4,
        expiryDate: newPayment.expiryDate,
        isDefault: paymentMethods.length === 0,
      });
    }
    
    setIsConfirmed(true);
    setTimeout(() => {
      const addressData = showNewAddress ? newAddress : selectedAddress!;
      const completedData = {
        items,
        totalPrice,
        deliveryType,
        deliveryDate: deliveryType === 'instant' ? new Date().toISOString().split('T')[0] : formData.deliveryDate,
        deliveryTime: deliveryType === 'instant' ? 'ASAP' : formData.deliveryTime,
        name: addressData.name,
        phone: addressData.phone,
        address: addressData.address,
        city: addressData.city,
        zipCode: addressData.zipCode,
      };
      onComplete(completedData);
    }, 2000);
  };
  
  const getCategoryIcon = (category: AddressCategory) => {
    switch (category) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'office':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  const handleDeliveryTypeSelect = (type: 'instant' | 'scheduled') => {
    setDeliveryType(type);
    if (type === 'instant') {
      setFormData({
        ...formData,
        deliveryDate: new Date().toISOString().split('T')[0],
        deliveryTime: 'ASAP'
      });
      setStep(2); // Skip schedule step, go to address
    } else {
      setStep(1); // Go to schedule step
    }
  };

  const getTotalSteps = () => {
    return deliveryType === 'instant' ? 3 : 4;
  };

  const getCurrentStepNumber = () => {
    if (step === 0) return 1;
    if (deliveryType === 'instant') {
      return step;
    }
    return step + 1;
  };

  if (isConfirmed) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-green-600 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            {deliveryType === 'instant' 
              ? 'Your groceries will be delivered as soon as possible (1-2 hours)'
              : `Your groceries will be delivered on ${formData.deliveryDate} at ${formData.deliveryTime}`
            }
          </p>
          <p className="text-sm text-gray-500">Order confirmation sent to your phone</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2>Complete Your Booking</h2>
            <p className="text-sm text-gray-500">Step {getCurrentStepNumber()} of {getTotalSteps()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map(s => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= getCurrentStepNumber() ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 0: Choose Delivery Type */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Choose Delivery Option</h3>
                <p className="text-sm text-gray-500">Select how you'd like to receive your order</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleDeliveryTypeSelect('instant')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-600 hover:bg-green-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Instant Delivery</h4>
                      <p className="text-sm text-gray-500">Get it ASAP</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your order will be delivered as soon as possible, typically within 1-2 hours
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeliveryTypeSelect('scheduled')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-600 hover:bg-green-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Schedule Delivery</h4>
                      <p className="text-sm text-gray-500">Pick date & time</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Choose a convenient date and time slot for your delivery
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Delivery Schedule (Only for Scheduled) */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <Calendar className="w-5 h-5" />
                <h3>Schedule Delivery</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                <CalendarPicker
                  value={formData.deliveryDate}
                  onChange={(date) => setFormData({ ...formData, deliveryDate: date })}
                  minDate={new Date().toISOString().split('T')[0]}
                  placeholder="Select delivery date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                <Dropdown
                  options={[
                    { value: '8:00 AM - 10:00 AM', label: '8:00 AM - 10:00 AM' },
                    { value: '10:00 AM - 12:00 PM', label: '10:00 AM - 12:00 PM' },
                    { value: '12:00 PM - 2:00 PM', label: '12:00 PM - 2:00 PM' },
                    { value: '2:00 PM - 4:00 PM', label: '2:00 PM - 4:00 PM' },
                    { value: '4:00 PM - 6:00 PM', label: '4:00 PM - 6:00 PM' },
                    { value: '6:00 PM - 8:00 PM', label: '6:00 PM - 8:00 PM' }
                  ]}
                  value={formData.deliveryTime}
                  onChange={(value) => setFormData({ ...formData, deliveryTime: value })}
                  placeholder="Select time slot"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.deliveryDate || !formData.deliveryTime}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Delivery Address */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <MapPin className="w-5 h-5" />
                <h3>Delivery Address</h3>
              </div>

              {!showNewAddress ? (
                <>
                  {/* Saved Addresses */}
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => setSelectedAddress(addr)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          selectedAddress?.id === addr.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            addr.category === 'home' ? 'bg-blue-100 text-blue-600' :
                            addr.category === 'office' ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getCategoryIcon(addr.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-900">{addr.name}</p>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded capitalize">
                                {addr.category}
                              </span>
                              {addr.isDefault && (
                                <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{addr.phone}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {addr.address}, {addr.city}, {addr.zipCode}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* New Address Button */}
                  <button
                    type="button"
                    onClick={() => setShowNewAddress(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-green-600"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Address</span>
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(deliveryType === 'instant' ? 0 : 1)}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!selectedAddress}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* New Address Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Address Category</label>
                      <select
                        value={newAddress.category}
                        onChange={(e) => setNewAddress({ ...newAddress, category: e.target.value as AddressCategory })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="saveAddress" className="text-sm text-gray-700">
                        Save this address for future orders
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewAddress(false)}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors"
                    >
                      Back to Saved
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.zipCode}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Payment & Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CreditCard className="w-5 h-5" />
                <h3>Payment Method</h3>
              </div>

              {!showNewPayment ? (
                <>
                  {/* Saved Payment Methods */}
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          selectedPayment?.id === method.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              💳
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                •••• •••• •••• {method.last4}
                              </p>
                              <p className="text-xs text-gray-600">
                                {method.cardholderName} • Expires {method.expiryDate}
                              </p>
                            </div>
                          </div>
                          {method.isDefault && (
                            <span className="text-xs px-2 py-1 bg-green-600 text-white rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* New Payment Button */}
                  <button
                    type="button"
                    onClick={() => setShowNewPayment(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-green-600"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Payment Method</span>
                  </button>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-medium">Order Summary</h4>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedPayment}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg transition-colors"
                    >
                      Complete Booking
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* New Payment Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={newPayment.cardholderName}
                        onChange={(e) => setNewPayment({ ...newPayment, cardholderName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={newPayment.cardNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
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
                          value={newPayment.expiryDate}
                          onChange={(e) => setNewPayment({ ...newPayment, expiryDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={newPayment.cvv}
                          onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="savePayment"
                        checked={saveNewPayment}
                        onChange={(e) => setSaveNewPayment(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="savePayment" className="text-sm text-gray-700">
                        Save this payment method for future orders
                      </label>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-medium">Order Summary</h4>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewPayment(false)}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors"
                    >
                      Back to Saved
                    </button>
                    <button
                      type="submit"
                      disabled={!newPayment.cardNumber || !newPayment.expiryDate || !newPayment.cvv || !newPayment.cardholderName}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg transition-colors"
                    >
                      Complete Booking
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
