import { useState } from 'react';
import { X, Calendar, Clock, MapPin, CreditCard, Check } from 'lucide-react';
import type { CartItem } from '@/types';
import { CalendarPicker } from '@/shared/components/ui/calendar-picker';
import { Dropdown } from '@/shared/components/ui/dropdown';

interface CheckoutModalProps {
  items: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onComplete: (bookingDetails: any) => void;
}

export function CheckoutModal({ items, totalPrice, onClose, onComplete }: CheckoutModalProps) {
  const [step, setStep] = useState(0);
  const [deliveryType, setDeliveryType] = useState<'instant' | 'scheduled' | null>(null);
  const [formData, setFormData] = useState({
    deliveryDate: '',
    deliveryTime: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmed(true);
    setTimeout(() => {
      const completedData = {
        ...formData,
        items,
        totalPrice,
        deliveryType,
        deliveryDate: deliveryType === 'instant' ? new Date().toISOString().split('T')[0] : formData.deliveryDate,
        deliveryTime: deliveryType === 'instant' ? 'ASAP' : formData.deliveryTime
      };
      onComplete(completedData);
    }, 2000);
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
              : `Your groceries will be delivered on ${formData.deliveryDate} between ${formData.deliveryTime}`
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

              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

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
                  disabled={!formData.name || !formData.address || !formData.city || !formData.zipCode || !formData.phone}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment & Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CreditCard className="w-5 h-5" />
                <h3>Payment Information</h3>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                    maxLength={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="text-sm">Order Summary</h4>
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
                <div className="border-t pt-3 flex justify-between">
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
                  disabled={!formData.cardNumber || !formData.expiryDate || !formData.cvv}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg transition-colors"
                >
                  Complete Booking
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
