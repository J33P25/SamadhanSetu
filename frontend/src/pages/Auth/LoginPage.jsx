import { useState } from 'react';
import { User, Shield, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import './LoginPage.css';

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAadharVerify = () => {
    if (formData.aadhar_number && formData.aadhar_number.length === 12) {
      setTimeout(() => setAadharVerified(true), 1500);
    }
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      role: userType === 'citizen' ? 'citizen' : 'district_leader',
      is_verified: aadharVerified
    };
    console.log('Form submitted:', { mode, payload });
    // Send payload to backend API
  };

  const resetForm = () => {
    setUserType(null);
    setMode('signin');
    setAadharVerified(false);
    setFormData({
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
  };

  if (!userType) {
    return (
      <div className="login-bg">
        <div className="login-container">
          <div className="login-header">
            <div className="login-icon">
              <Shield className="icon" />
            </div>
            <h1 className="login-title">Welcome</h1>
            <p className="login-subtitle">Select your account type to continue</p>
          </div>

          <div className="login-choices">
            <button onClick={() => setUserType('citizen')} className="btn-citizen">
              <User className="icon-blue" />
              <span>Citizen Login</span>
            </button>
            <button onClick={() => setUserType('officer')} className="btn-officer">
              <Shield className="icon" />
              <span>Officer Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-card-header">
            <button onClick={resetForm} className="btn-back">
              <ArrowLeft className="icon-gray" />
            </button>
            <div className="login-card-title">
              {userType === 'citizen' ? <User className="icon-blue" /> : <Shield className="icon-blue" />}
              <h2>{userType === 'citizen' ? 'Citizen' : 'Officer'} {mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
            </div>
          </div>

          {/* Citizen toggle */}
          {userType === 'citizen' && (
            <div className="toggle-mode">
              <button onClick={() => setMode('signin')} className={mode === 'signin' ? 'toggle-active' : ''}>Sign In</button>
              <button onClick={() => setMode('signup')} className={mode === 'signup' ? 'toggle-active' : ''}>Sign Up</button>
            </div>
          )}

          {/* Form */}
          <div className="form">
            {/* Sign Up Form for Citizen */}
            {mode === 'signup' && userType === 'citizen' && (
              <>
                {/* Full Name */}
                <div>
                  <label>Full Name</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
                </div>

                {/* Email */}
                <div>
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>

                {/* Phone */}
                <div>
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>

                {/* Password */}
                <div>
                  <label>Password</label>
                  <div className="input-password">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>

                {/* Aadhar Number */}
                <div>
                  <label>Aadhar Number</label>
                  <div className="input-verify">
                    <input type="text" name="aadhar_number" value={formData.aadhar_number} onChange={handleInputChange} maxLength="12" required />
                    <button type="button" onClick={handleAadharVerify} disabled={aadharVerified || formData.aadhar_number.length !== 12} className={aadharVerified ? 'btn-verified' : 'btn-verify'}>
                      {aadharVerified ? <CheckCircle /> : 'Verify'}
                    </button>
                  </div>
                  {aadharVerified && <p className="verified-text">Aadhar verified successfully</p>}
                </div>

                {/* Address */}
                <div>
                  <label>Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" />
                </div>
              </>
            )}

            {/* Sign In Form or Officer Sign Up */}
            {mode === 'signin' || userType === 'officer' ? (
              <>
                {/* Email */}
                <div>
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>

                {/* Password */}
                <div>
                  <label>Password</label>
                  <div className="input-password">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            <button onClick={handleSubmit} className="btn-submit">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          {/* Footer links */}
          {mode === 'signin' && userType === 'citizen' && (
            <p className="footer-text">
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="link">Sign up here</button>
            </p>
          )}
          {mode === 'signin' && <button className="link">Forgot password?</button>}
        </div>
      </div>
    </div>
  );
}
