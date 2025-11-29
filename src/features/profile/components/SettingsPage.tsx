import { useState } from 'react';
import { ChevronLeft, Bell, Globe, Moon, Lock, HelpCircle, LogOut, Trash2, Clock, Eye, EyeOff } from 'lucide-react';
import { Dropdown } from '@/shared/components/ui/dropdown';
import { useAuth } from '@/features/auth';

interface SettingsPageProps {
  onBack?: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { logout, autoLogoutTime, setAutoLogoutTime } = useAuth();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    darkMode: false,
    language: 'en',
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordStep, setPasswordStep] = useState<'verify' | 'otp' | 'newPassword'>('verify');
  const [phoneLastDigits, setPhoneLastDigits] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleDeleteAccount = () => {
    // Clear all user data
    localStorage.removeItem('user');
    logout();
    setShowDeleteConfirm(false);
  };

  const handleVerifyPhone = () => {
    setPasswordError('');
    
    // Get user data from localStorage or use admin default
    const storedUser = localStorage.getItem('user');
    const sessionData = localStorage.getItem('auth_session');
    
    let userPhone = '+1 (555) 123-4567'; // Default admin phone
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      userPhone = user.phone || '+1 (555) 123-4567';
    } else if (sessionData) {
      // User is logged in as admin (no stored user data)
      const session = JSON.parse(sessionData);
      if (session.username === 'admin') {
        userPhone = '+1 (555) 123-4567'; // Admin phone
      }
    }

    const lastFour = userPhone.replace(/\D/g, '').slice(-4);

    if (phoneLastDigits !== lastFour) {
      setPasswordError('Last 4 digits do not match. Please try again.');
      return;
    }

    // Generate OTP
    const generatedOtpCode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log('🔐 Generated OTP:', generatedOtpCode); // For demo purposes - logged immediately
    setGeneratedOtp(generatedOtpCode);
    setIsLoading(true);

    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setPasswordStep('otp');
      alert(`OTP sent to ${userPhone.slice(0, -4)}****\n\nCheck console for OTP: ${generatedOtpCode}`);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setPasswordError('');
    
    if (otp !== generatedOtp) {
      setPasswordError('Invalid OTP. Please try again.');
      return;
    }

    setPasswordStep('newPassword');
  };

  const handleChangePassword = () => {
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const storedUser = localStorage.getItem('user');
      const sessionData = localStorage.getItem('auth_session');
      
      if (storedUser) {
        // Update registered user password
        const user = JSON.parse(storedUser);
        user.password = newPassword;
        localStorage.setItem('user', JSON.stringify(user));
      } else if (sessionData) {
        // Create user entry for admin if changing password
        const session = JSON.parse(sessionData);
        if (session.username === 'admin') {
          const adminUser = {
            username: 'admin',
            phone: '+1 (555) 123-4567',
            email: 'admin@freshcart.com',
            password: newPassword
          };
          localStorage.setItem('user', JSON.stringify(adminUser));
        }
      }

      setIsLoading(false);
      setShowChangePassword(false);
      setPasswordStep('verify');
      setPhoneLastDigits('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password changed successfully!');
    }, 1000);
  };

  const closePasswordModal = () => {
    setShowChangePassword(false);
    setPasswordStep('verify');
    setPhoneLastDigits('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h1>Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your app preferences</p>
        </div>

        <div className="divide-y">
          {/* Notifications */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-gray-600" />
              <h3>Notifications</h3>
            </div>
            <div className="space-y-4 ml-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Push Notifications</p>
                  <p className="text-xs text-gray-500">Receive push notifications on your device</p>
                </div>
                <button
                  onClick={() => toggleSetting('pushNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.pushNotifications ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive updates via email</p>
                </div>
                <button
                  onClick={() => toggleSetting('emailNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Order Updates</p>
                  <p className="text-xs text-gray-500">Get notified about order status</p>
                </div>
                <button
                  onClick={() => toggleSetting('orderUpdates')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.orderUpdates ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Promotions & Offers</p>
                  <p className="text-xs text-gray-500">Receive promotional emails</p>
                </div>
                <button
                  onClick={() => toggleSetting('promotions')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.promotions ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.promotions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="w-5 h-5 text-gray-600" />
              <h3>Appearance</h3>
            </div>
            <div className="ml-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Dark Mode</p>
                  <p className="text-xs text-gray-500">Switch to dark theme</p>
                </div>
                <button
                  onClick={() => toggleSetting('darkMode')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.darkMode ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-gray-600" />
              <h3>Language</h3>
            </div>
            <div className="ml-8">
              <Dropdown
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Español' },
                  { value: 'fr', label: 'Français' },
                  { value: 'de', label: 'Deutsch' },
                  { value: 'it', label: 'Italiano' }
                ]}
                value={settings.language}
                onChange={(value) => setSettings({ ...settings, language: value })}
                placeholder="Select language"
              />
            </div>
          </div>

          {/* Security */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-gray-600" />
              <h3>Security</h3>
            </div>
            <div className="ml-8 space-y-3">
              <button 
                onClick={() => setShowChangePassword(true)}
                className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm text-gray-900">Change Password</p>
                <p className="text-xs text-gray-500">Update your password</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Add an extra layer of security</p>
              </button>
            </div>
          </div>

          {/* Session Management */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3>Session Management</h3>
            </div>
            <div className="ml-8">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900 mb-2">Auto Logout Timer</p>
                <p className="text-xs text-gray-500 mb-3">
                  Automatically log out after a period of inactivity for security
                </p>
                <Dropdown
                  options={[
                    { value: '5', label: '5 minutes' },
                    { value: '10', label: '10 minutes (Default)' },
                    { value: '15', label: '15 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 hour' },
                    { value: '120', label: '2 hours' },
                  ]}
                  value={autoLogoutTime.toString()}
                  onChange={(value) => setAutoLogoutTime(parseInt(value, 10))}
                  placeholder="Select timeout duration"
                />
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ Changing this will restart your current session
                </p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <h3>Support</h3>
            </div>
            <div className="ml-8 space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-900">Help Center</p>
                <p className="text-xs text-gray-500">Get answers to common questions</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-900">Contact Support</p>
                <p className="text-xs text-gray-500">Reach out to our support team</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-sm text-gray-900">Terms & Privacy</p>
                <p className="text-xs text-gray-500">Read our policies</p>
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="p-6">
            <div className="space-y-3">
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 p-4 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 p-4 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-96 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">Confirm Logout</h3>
            <p className="text-gray-600 text-sm mb-8">
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-96 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3 text-red-600">Delete Account</h3>
            <p className="text-gray-600 text-sm mb-8">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closePasswordModal}
        >
          <div 
            className="bg-white rounded-xl p-6 w-96 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            
            {/* Step 1: Verify Phone Number */}
            {passwordStep === 'verify' && (
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Enter the last 4 digits of your registered phone number to verify your identity.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last 4 Digits of Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneLastDigits}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) setPhoneLastDigits(value);
                    }}
                    placeholder="1234"
                    maxLength={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                {passwordError && (
                  <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
                    {passwordError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={closePasswordModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyPhone}
                    disabled={phoneLastDigits.length !== 4 || isLoading}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Enter OTP */}
            {passwordStep === 'otp' && (
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Enter the 4-digit OTP sent to your registered phone number.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    One-Time Password (OTP)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) setOtp(value);
                    }}
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                {passwordError && (
                  <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
                    {passwordError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={closePasswordModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 4}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Set New Password */}
            {passwordStep === 'newPassword' && (
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Enter your new password.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {passwordError && (
                  <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
                    {passwordError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={closePasswordModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={!newPassword || !confirmPassword || isLoading}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
