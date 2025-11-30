import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Camera, Settings, Plus, Home, Briefcase, MoreHorizontal, Trash2 } from 'lucide-react';
import { SettingsPage } from './SettingsPage';
import { useUserProfile } from '../contexts/UserProfileContext';
import type { Address, AddressCategory } from '@/types';

export function ProfilePage() {
  const { profile, updateProfile, addresses, addAddress, deleteAddress, setDefaultAddress } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
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

  const handleSave = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    });
    setIsEditing(false);
  };
  
  const handleAddAddress = () => {
    addAddress(newAddress);
    setNewAddress({
      name: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      category: 'home',
      isDefault: false,
    });
    setShowAddAddress(false);
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

  if (showSettings) {
    return <SettingsPage onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-green-600" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-white">{profile.name}</h1>
              <p className="text-green-100 text-sm">Member since Nov 2025</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2>Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
            ) : null}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                ) : (
                  <p className="text-gray-900">{profile.email}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone}</p>
                )}
              </div>
            </div>

          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Saved Addresses */}
        <div className="border-t p-6">
          <div className="flex items-center justify-between mb-4">
            <h2>Saved Addresses</h2>
            <button
              onClick={() => setShowAddAddress(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          </div>

          {showAddAddress && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium mb-3">Add New Address</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <select
                  value={newAddress.category}
                  onChange={(e) => setNewAddress({ ...newAddress, category: e.target.value as AddressCategory })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="setDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="setDefault" className="text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddAddress(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAddress}
                    disabled={!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.zipCode}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 text-sm transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {addresses.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">No saved addresses</p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    addr.isDefault ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        addr.category === 'home' ? 'bg-blue-100 text-blue-600' :
                        addr.category === 'office' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getCategoryIcon(addr.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{addr.name}</p>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded capitalize">
                            {addr.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{addr.phone}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {addr.address}, {addr.city}, {addr.zipCode}
                        </p>
                        {addr.isDefault && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Settings Link */}
        <div className="border-t p-6">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Settings & Preferences</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
