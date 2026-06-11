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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
          <h3 className="text-[15px] font-semibold text-gray-800">
            {mode === 'search' ? 'Search Vehicle & Driver' : 'Add New Vehicle & Driver'}
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              <p className="text-xs font-semibold mb-0.5">Error</p>
              <p className="text-[13px]">{error}</p>
            </div>
          )}

          <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100 mb-5">
            <button
              className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-all ${
                mode === 'search' ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setMode('search')}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Search className="w-3.5 h-3.5" strokeWidth={2} />
                Search
              </div>
            </button>
            <button
              className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-all ${
                mode === 'create' ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setMode('create')}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                Create New
              </div>
            </button>
          </div>

          {mode === 'search' && (
            <div>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full h-9 pl-9 pr-3 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                  placeholder="Search by Vehicle No, Driver Name or Mobile..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                {isLoading ? (
                  <div className="flex justify-center py-8 text-blue-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : results.length > 0 ? (
                  results.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      onClick={() => {
                        onSelect(vehicle);
                        handleClose();
                      }}
                      className="p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors group flex items-start"
                    >
                      <div className="mt-0.5 bg-blue-50 text-blue-600 p-1.5 rounded-lg border border-blue-100 mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800 group-hover:text-blue-700">{vehicle.vehicleNumber} ({vehicle.driverName})</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          <span className="font-medium text-gray-600">Mob:</span> {vehicle.driverPhone}
                          {vehicle.vehicleType && <span className="ml-3"><span className="font-medium text-gray-600">Type:</span> {vehicle.vehicleType}</span>}
                        </p>
                      </div>
                    </div>
                  ))
                ) : query.length >= 2 ? (
                  <div className="text-center py-8 text-gray-500 text-[13px] bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-[13px]">
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
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Vehicle Number *</label>
                  <input
                    type="text"
                    required
                    className="w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 uppercase"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    placeholder="e.g. AP 16 TG 1234"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    className="w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                    placeholder="e.g. 10 Wheeler"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    value={formData.driverName}
                    onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Driver Phone *</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{10}"
                    className="w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({...formData, driverPhone: e.target.value.replace(/\D/g, '').slice(0,10)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">RC Number</label>
                  <input
                    type="text"
                    className="w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 uppercase"
                    value={formData.rcNumber}
                    onChange={(e) => setFormData({...formData, rcNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Driver License</label>
                  <input
                    type="text"
                    className="w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 uppercase"
                    value={formData.driverLicense}
                    onChange={(e) => setFormData({...formData, driverLicense: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 px-5 py-2.5 text-[13px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> : `Save & Select`}
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
