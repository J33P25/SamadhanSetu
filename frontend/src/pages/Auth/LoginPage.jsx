import { useState } from 'react';
import { User, Shield, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [userType, setUserType] = useState(null);
  const [mode, setMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    aadhar_number: '',
    address: '',
    officerId: '',
    department: '',
    designation: ''
  });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAadharVerify = () => {
    if (formData.aadhar_number && formData.aadhar_number.length === 12) {
      setTimeout(() => setAadharVerified(true), 1500);
    }
  };

  const handleSubmit = () => {
    const payload = { ...formData, role: userType === 'citizen' ? 'citizen' : 'district_leader', is_verified: aadharVerified };
    console.log('Form submitted:', { mode, payload });
    // Send payload to backend API
  };

  const resetForm = () => {
    setUserType(null);
    setMode('signin');
    setAadharVerified(false);
    setFormData({
      full_name: '', email: '', password: '', confirmPassword: '', phone: '', aadhar_number: '', address: '', officerId: '', department: '', designation: ''
    });
  };

  if (!userType) {
    return (
      <div
        className="min-h-screen flex justify-center items-center p-4"
        style={{ background: 'linear-gradient(135deg, #053a2b, #0b3f35)' }}
      >
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
              <Shield className="text-[#053a2b]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome</h1>
            <p className="text-gray-300">Select your account type to continue</p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setUserType('citizen')}
              className="flex items-center justify-center gap-3 px-6 py-4 font-semibold rounded-xl bg-white text-[#053a2b] shadow hover:scale-105 transition-transform"
            >
              <User className="text-[#0b3f35]" /> Citizen Login
            </button>
            <button
              onClick={() => setUserType('officer')}
              className="flex items-center justify-center gap-3 px-6 py-4 font-semibold rounded-xl text-white shadow hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(to right, #053a2b, #0b3f35)' }}
            >
              <Shield /> Officer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center p-4"
      style={{ background: 'linear-gradient(135deg, #053a2b, #0b3f35)' }}
    >
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={resetForm} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="text-gray-500" />
          </button>
          <div className="flex items-center gap-2 ml-2">
            {userType === 'citizen' ? <User className="text-[#0b3f35]" /> : <Shield className="text-[#0b3f35]" />}
            <h2 className="text-xl font-bold text-gray-800">{userType === 'citizen' ? 'Citizen' : 'Officer'} {mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
          </div>
        </div>

        {/* Citizen Toggle */}
        {userType === 'citizen' && (
          <div className="flex bg-gray-100 rounded-md p-1 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 rounded-md font-medium ${mode === 'signin' ? 'bg-[#053a2b] text-white shadow' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-md font-medium ${mode === 'signup' ? 'bg-[#053a2b] text-white shadow' : ''}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Sign Up Citizen Form */}
          {mode === 'signup' && userType === 'citizen' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3 focus:border-[#0b3f35] focus:ring-1 focus:ring-[#0b3f35] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3 focus:border-[#0b3f35] focus:ring-1 focus:ring-[#0b3f35] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3 focus:border-[#0b3f35] focus:ring-1 focus:ring-[#0b3f35] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-3 pr-12 focus:border-[#0b3f35] focus:ring-1 focus:ring-[#0b3f35] outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0b3f35]"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3 focus:border-[#0b3f35] focus:ring-1 focus:ring-[#0b3f35] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Aadhar Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="aadhar_number"
                    value={formData.aadhar_number}
                    onChange={handleInputChange}
                    maxLength="12"
                    className="flex-1 border rounded-md p-3 focus:border-[#0b3f35] focus:ring-1 focus:ring-[#0b3f35] outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAadharVerify}
                    disabled={aadharVerified || formData.aadhar_number.length !== 12}
                    className={`px-4 rounded-md ${aadharVerified ? 'bg-green-100 text-green-700 border-green-300' : 'bg-[#053a2b] text-white'}`}
                  >
                    {aadharVerified ? <CheckCircle /> : 'Verify'}
                  </button>
                </div>
                {aadharVerified && <p className="text-green-600 mt-1 flex items-center gap-1">Aadhar verified successfully</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border rounded-md p-3 focus:border-[#0b3f35] focus:ring-1 focus:ring-[#0b3f35] outline-none"
                />
              </div>
            </>
          )}

          {/* Sign In Form or Officer Form */}
          {(mode === 'signin' || userType === 'officer') && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3 focus:border-[#0b3f35] focus:ring-1 focus:ring-[#0b3f35] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-3 pr-12 focus:border-[#0b3f35] focus:ring-1 focus:ring-[#0b3f35] outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0b3f35]"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            className="mt-4 py-3 text-white font-semibold rounded-md shadow hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(to right, #053a2b, #0b3f35)' }}
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        {/* Footer */}
        {mode === 'signin' && userType === 'citizen' && (
          <p className="mt-4 text-gray-500 text-sm">
            Don't have an account?{' '}
            <button onClick={() => setMode('signup')} className="text-[#053a2b] font-medium hover:text-[#0b3f35]">
              Sign up here
            </button>
          </p>
        )}
        {mode === 'signin' && <button className="text-[#053a2b] mt-2 text-sm hover:text-[#0b3f35]">Forgot password?</button>}
      </div>
    </div>
  );
}
