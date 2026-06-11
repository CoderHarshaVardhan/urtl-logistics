import React, { useState, useEffect } from 'react';
import { Search, Plus, X, UserCheck, Loader2 } from 'lucide-react';

const PartyModal = ({ isOpen, onClose, onSelect, title, searchApi, createApi }) => {
  const [mode, setMode] = useState('search'); // 'search' or 'create'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create form state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    gstNo: ''
  });

  // Debounced search
  useEffect(() => {
    if (mode !== 'search') return;
    
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await searchApi(query);
        setResults(response.data || []);
      } catch (err) {
        setError('Failed to search. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, mode, searchApi]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await createApi(formData);
      onSelect(response.data); // Auto-select newly created
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMode('search');
    setQuery('');
    setResults([]);
    setFormData({ name: '', mobile: '', gstNo: '' });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">
            {mode === 'search' ? `Search ${title}` : `Add New ${title}`}
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'search' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setMode('search')}
            >
              <div className="flex items-center justify-center">
                <Search className="w-4 h-4 mr-2" />
                Search
              </div>
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'create' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setMode('create')}
            >
              <div className="flex items-center justify-center">
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </div>
            </button>
          </div>

          {/* Search Mode */}
          {mode === 'search' && (
            <div>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                  placeholder="Search by Name, Mobile or GST..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                {isLoading ? (
                  <div className="flex justify-center py-8 text-blue-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : results.length > 0 ? (
                  results.map((party) => (
                    <div
                      key={party._id}
                      onClick={() => {
                        onSelect(party);
                        handleClose();
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors group flex items-start"
                    >
                      <div className="mt-1 bg-blue-100 text-blue-600 p-1.5 rounded-full mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-700">{party.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          <span className="font-medium">Mob:</span> {party.mobile}
                          {party.gstNo && <span className="ml-3"><span className="font-medium">GST:</span> {party.gstNo}</span>}
                        </p>
                      </div>
                    </div>
                  ))
                ) : query.length >= 2 ? (
                  <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Type at least 2 characters to search
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Create Mode */}
          {mode === 'create' && (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={`Enter ${title} Name`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '').slice(0,10)})}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase transition-shadow"
                  value={formData.gstNo}
                  onChange={(e) => setFormData({...formData, gstNo: e.target.value.toUpperCase()})}
                  placeholder="e.g. 22AAAAA0000A1Z5"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Save & Select ${title}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartyModal;
