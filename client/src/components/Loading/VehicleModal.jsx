import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Truck, Loader2 } from 'lucide-react';

const VehicleModal = ({ isOpen, onClose, onSelect, searchApi, createApi }) => {
  const [mode, setMode] = useState('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    driverName: '',
    driverPhone: '',
    vehicleNumber: '',
    rcNumber: '',
    vehicleType: '',
    driverLicense: ''
  });

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
      onSelect(response.data);
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
    setFormData({ driverName: '', driverPhone: '', vehicleNumber: '', rcNumber: '', vehicleType: '', driverLicense: '' });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">
            {mode === 'search' ? 'Search Vehicle & Driver' : 'Add New Vehicle & Driver'}
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

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

          {mode === 'search' && (
            <div>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                  placeholder="Search by Vehicle No, Driver Name or Mobile..."
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
                  results.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      onClick={() => {
                        onSelect(vehicle);
                        handleClose();
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors group flex items-start"
                    >
                      <div className="mt-1 bg-blue-100 text-blue-600 p-1.5 rounded-full mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-700">{vehicle.vehicleNumber} ({vehicle.driverName})</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          <span className="font-medium">Mob:</span> {vehicle.driverPhone}
                          {vehicle.vehicleType && <span className="ml-3"><span className="font-medium">Type:</span> {vehicle.vehicleType}</span>}
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

          {mode === 'create' && (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-shadow"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    placeholder="e.g. AP 16 TG 1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                    placeholder="e.g. 10 Wheeler"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    value={formData.driverName}
                    onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver Phone *</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({...formData, driverPhone: e.target.value.replace(/\D/g, '').slice(0,10)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RC Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-shadow"
                    value={formData.rcNumber}
                    onChange={(e) => setFormData({...formData, rcNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver License</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-shadow"
                    value={formData.driverLicense}
                    onChange={(e) => setFormData({...formData, driverLicense: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Save & Select`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;
