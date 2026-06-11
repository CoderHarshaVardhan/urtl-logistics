import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Lock, Shield } from 'lucide-react';

const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        branch: user.branch || '',
        password: '',
        role: user.role || 'user',
      });
    } else {
      setFormData({ name: '', branch: '', password: '', role: 'user' });
    }
    setError(null);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'name') {
      value = value.toLowerCase();
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="absolute inset-0 bg-white/10 opacity-50"></div>
          <div className="relative flex justify-between items-center z-10">
            <h3 className="text-xl font-extrabold text-white drop-shadow-sm">
              {user ? 'Edit User Details' : 'Add New User'}
            </h3>
            <button 
              onClick={onClose} 
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors backdrop-blur-sm"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-6">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <p className="text-xs font-semibold mb-0.5">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Name / Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g., john.doe"
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Branch</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="branch"
                required
                value={formData.branch}
                onChange={handleChange}
                className="block w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200 appearance-none"
              >
                <option value="" disabled>Select a branch</option>
                <option value="Auto Nagar">Auto Nagar</option>
                <option value="Vizag">Vizag</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-baseline text-sm font-bold text-gray-700">
              Password
              {user && <span className="ml-2 text-xs font-medium text-gray-400">(Leave blank to keep current)</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                required={!user}
                minLength={6}
                placeholder={user ? "••••••••" : "Create a strong password"}
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200 appearance-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {isLoading ? 'Saving...' : (user ? 'Save Changes' : 'Create User')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserModal;
