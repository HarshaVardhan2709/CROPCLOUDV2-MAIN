'use client';

import { useState } from 'react';

export default function CreateAdminPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, fullName, password, confirmPassword } = formData;

    if (!email || !fullName || !password) {
      setMessage({ type: 'error', text: 'Email, Full Name, and Password are required' });
      return false;
    }

    if (!email.includes('@')) {
      setMessage({ type: 'error', text: 'Invalid email format' });
      return false;
    }

    if (password.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters long',
      });
      return false;
    }

    if (!/(?=.*[a-z])/.test(password)) {
      setMessage({
        type: 'error',
        text: 'Password must contain at least one lowercase letter',
      });
      return false;
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      setMessage({
        type: 'error',
        text: 'Password must contain at least one uppercase letter',
      });
      return false;
    }

    if (!/(?=.*\d)/.test(password)) {
      setMessage({
        type: 'error',
        text: 'Password must contain at least one number',
      });
      return false;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch('/api/v1/admin/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone || undefined,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to create admin account',
        });
        return;
      }

      setMessage({
        type: 'success',
        text: `${result.message} Share the credentials with the new admin.`,
      });

      // Reset form
      setFormData({
        email: '',
        fullName: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Admin Account</h1>
          <p className="text-gray-600 mt-2">
            Create a new admin account that will start in PENDING status and require your approval.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@cropcloud.dev"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Phone (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Set a strong password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Password Requirements:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                ✓ At least 8 characters long{' '}
                {formData.password.length >= 8 ? '✅' : '❌'}
              </li>
              <li>
                ✓ Contains uppercase letter{' '}
                {/[A-Z]/.test(formData.password) ? '✅' : '❌'}
              </li>
              <li>
                ✓ Contains lowercase letter{' '}
                {/[a-z]/.test(formData.password) ? '✅' : '❌'}
              </li>
              <li>
                ✓ Contains number {/\d/.test(formData.password) ? '✅' : '❌'}
              </li>
              <li>
                ✓ Passwords match{' '}
                {formData.password && formData.confirmPassword && 
                formData.password === formData.confirmPassword ? '✅' : '❌'}
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
            <button
              type="reset"
              onClick={() => {
                setFormData({
                  email: '',
                  fullName: '',
                  phone: '',
                  password: '',
                  confirmPassword: '',
                });
                setMessage(null);
              }}
              className="px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>
              The new admin will be created with <strong>PENDING</strong> status
            </li>
            <li>
              You (primary admin) must <strong>approve</strong> the account before they can access
              admin features
            </li>
            <li>
              Share the email and password with the new admin securely (not via email/chat)
            </li>
            <li>
              The new admin can change their password after first login
            </li>
          </ul>
        </div>
    </div>
  );
}
