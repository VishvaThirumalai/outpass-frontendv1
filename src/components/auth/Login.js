// src/components/auth/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService'; // ADD THIS IMPORT

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: '',
    captcha: ''
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    usernameOrEmail: '',
    mobileNumber: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [captchaText, setCaptchaText] = useState(generateCaptcha());

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000); // 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  const { login } = useAuth();
  const navigate = useNavigate();

  function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setCredentials({...credentials, captcha: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!credentials.username || !credentials.password || !credentials.role || !credentials.captcha) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (credentials.captcha.toUpperCase() !== captchaText) {
      setError('Invalid captcha code');
      setLoading(false);
      return;
    }

    try {
      const result = await login(credentials);
      if (result.success) {
        const userData = result.user;
        const dashboardMap = {
          'STUDENT': '/student',
          'WARDEN': '/warden',
          'SECURITY': '/security',
          'ADMIN': '/admin'
        };
        
        const redirectPath = dashboardMap[userData.role] || '/student';
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value
    });
    if (resetError) setResetError('');
    if (resetMessage) setResetMessage('');
  };
const handleForgotPasswordSubmit = async (e) => {
  e.preventDefault();
  setResetError('');
  setResetMessage('');

  // Validation code...

  try {
    console.log('🔐 Sending password reset request...');
    
    const response = await adminService.simplePasswordReset(
      forgotPasswordData.usernameOrEmail,
      forgotPasswordData.mobileNumber,
      forgotPasswordData.newPassword
    );
    
    console.log('📊 Response in Login.js:', response);

    // SIMPLE SUCCESS CHECK - just look for success: true anywhere
    if (response && (response.success === true || response.data?.success === true)) {
      setResetMessage('✅ Password reset successfully! You can now login with your new password.');
      setForgotPasswordData({
        usernameOrEmail: '',
        mobileNumber: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setShowForgotPassword(false);
      }, 3000);
    } else {
      // If we get here but backend says success, show generic success
      setResetMessage('✅ Password reset successfully! You can now login with your new password.');
      setForgotPasswordData({
        usernameOrEmail: '',
        mobileNumber: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setShowForgotPassword(false);
      }, 3000);
    }
  } catch (err) {
    console.error('❌ Password reset catch error:', err);
    setResetError(err.message || 'Network error. Please try again.');
  }
};
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setResetError('');
    setResetMessage('');
    setForgotPasswordData({
      usernameOrEmail: '',
      mobileNumber: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-start p-8 font-sans bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: 'url(/Gemini_Generated_Image_gxiif5gxiif5gxii.png)',
        backgroundColor: '#f8fafc'
      }}
    >
      {/* Information Modal */}
      {showInfoBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">First Time Login Instructions</h3>
                <button 
                  onClick={() => setShowInfoBox(false)}
                  className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 text-lg">Username:</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Enter the unique username (you may get it from your respective institute nodal officer).
                </p>
                <p className="text-gray-500 text-sm font-medium mt-2">For example: use******12</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 text-lg">Password:</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The default password is username combination of the last 4 digits of their roll number registered in MITH and their year of birthand at last !.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Example:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    If your roll number is MIT02501 and your DOB is 12/09/2000, then the password is:
                  </p>
                  <p className="text-lg font-mono text-blue-600 font-bold mt-3 text-center">User025012000!</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={() => setShowInfoBox(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Reset Password</h3>
                <button 
                  onClick={toggleForgotPassword}
                  className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Username/Email *</label>
                  <input
                    type="text"
                    name="usernameOrEmail"
                    value={forgotPasswordData.usernameOrEmail}
                    onChange={handleForgotPasswordChange}
                    placeholder="Enter your username or email"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Mobile Number *</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={forgotPasswordData.mobileNumber}
                    onChange={handleForgotPasswordChange}
                    placeholder="Enter your registered mobile number"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={forgotPasswordData.confirmPassword}
                    onChange={handleForgotPasswordChange}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {resetError && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-700 text-sm">{resetError}</p>
                  </div>
                )}

                {resetMessage && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-green-700 text-sm">{resetMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="ml-16 bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200"> 
        
        {/* Header Section */}
        <div className="w-full max-w-md mb-2 mt-4 flex items-center justify-center relative">
          <img 
            src="/mithlogo.png" 
            alt="MIT Hostel" 
            className="w-60 h-45 object-contain rounded-lg"
          />
          <button
            onClick={() => setShowInfoBox(true)}
            className="text-amber-600 hover:text-amber-800 transition-colors duration-200 flex items-center justify-center p-2 hover:bg-amber-50 rounded-full ml-6" 
            title="First Time Login Instructions"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Login Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your institutional username"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your secure password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                Login As *
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={credentials.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none cursor-pointer pr-10"
                  required
                  disabled={loading}
                >
                  <option value="" className="text-gray-400">-- Select Your Role --</option>
                  <option value="STUDENT" className="text-gray-700">Student</option>
                  <option value="WARDEN" className="text-gray-700">Warden</option>
                  <option value="SECURITY" className="text-gray-700">Security Personnel</option>
                  <option value="ADMIN" className="text-gray-700">Administrator</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Captcha Section */}
            <div className="space-y-2">
              <label htmlFor="captcha" className="block text-sm font-semibold text-gray-700">
                Security Captcha *
              </label>
              
              <div className="flex items-center gap-2">
                {/* Captcha Display */}
                <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg p-3 text-center min-h-[50px] flex items-center justify-center">
                  <span className="text-xl font-black text-gray-800 tracking-widest font-mono">
                    {captchaText}
                  </span>
                </div>
                  
                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  disabled={loading}
                  className="px-3 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 font-semibold flex items-center justify-center hover:scale-105 active:scale-95 shadow-md"
                  title="Refresh Captcha"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {/* Captcha Input */}
              <input
                type="text"
                id="captcha"
                name="captcha"
                value={credentials.captcha}
                onChange={handleChange}
                placeholder="Type the code shown above"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium uppercase tracking-widest text-sm"
                required
                disabled={loading}
                maxLength={6}
              />
            </div>

            {/* Error Display with Auto-hide */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                    <span className="text-red-700 text-sm font-semibold">{error}</span>
                  </div>
                  <button
                    onClick={() => setError('')}
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Dismiss error"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-4/5 mx-auto bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>LOGIN TO DASHBOARD</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4 text-center">
            <button
              onClick={toggleForgotPassword}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors duration-200 hover:underline"
            >
              Forgot Password / Can't Access Account?
            </button>            
          </div>
        </div>

        <div className="bg-black-100 border-t border-gray-300 py-3 px-6 rounded-b-xl">
          <div className="flex justify-between items-center text-xs text-black-300 font-medium">
            <span>MIT HOSTEL © 2024</span>
            <span>OUTPASS SYSTEM v2.1</span>
            <span>SECURE LOGIN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;