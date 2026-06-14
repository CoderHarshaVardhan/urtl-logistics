import React, { useState, useEffect } from 'react';
import { Save, Loader2, Search, CheckSquare, Printer, RefreshCw } from 'lucide-react';
import { createLoading, updateLoading } from '../../services/loading.service';
import { searchVehicles, createVehicle } from '../../services/vehicle.service';
import { getAvailableLRs } from '../../services/lr.service';
import VehicleModal from './VehicleModal';
import { useAuth } from '../../hooks/useAuth';

/* ─── tiny helpers ─────────────────────────────────────────────────────── */
const Field = ({ label, children, className = '' }) => (
  <div className={className}>
    <label className="block text-[11px] font-medium text-gray-500 mb-1 print:mb-0">{label}</label>
    {children}
  </div>
);

const inputCls =
  'w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 ' +
  'focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ' +
  'print:border-gray-400 print:py-0.5 print:h-auto';

const readonlyCls =
  'w-full h-8 px-2.5 text-[13px] border border-gray-200 rounded-lg bg-gray-50 text-gray-700 ' +
  'cursor-default print:border-gray-400 print:py-0.5 print:h-auto';

/* ─── component ─────────────────────────────────────────────────────────── */
const LoadingForm = ({ initialData }) => {
  const { user } = useAuth();
  const isEditMode = !!initialData?._id;
  const [activeModal, setActiveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [availableLRs, setAvailableLRs] = useState([]);
  const [lrSearchQuery, setLrSearchQuery] = useState('');
  const [isFetchingLRs, setIsFetchingLRs] = useState(true);

  const [formData, setFormData] = useState({
    loadingNumber: initialData?.loadingNumber || '',
    branch: user?.branch || '',
    date: new Date().toISOString().split('T')[0],
    fromPlace: '',
    toPlace: '',
    vehicle: null,
    selectedLRs: [] // Array of { lrId, lrNumber }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        loadingNumber: initialData.loadingNumber || '',
        branch: initialData.branch || user?.branch || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : prev.date,
        fromPlace: initialData.fromPlace || '',
        toPlace: initialData.toPlace || '',
        vehicle: initialData.vehicle || null,
      }));
    }
  }, [initialData, user]);

  useEffect(() => {
    const fetchLRs = async () => {
      setIsFetchingLRs(true);
      try {
        const response = await getAvailableLRs();
        let fetchedLRs = response.data || [];
        
        if (initialData && initialData.fullLRs) {
          const existingIds = new Set(fetchedLRs.map(lr => lr._id));
          const extraLRs = initialData.fullLRs.filter(lr => !existingIds.has(lr._id));
          fetchedLRs = [...extraLRs, ...fetchedLRs];
        }

        setAvailableLRs(fetchedLRs);
        
        if (initialData && initialData.lrs && formData.selectedLRs.length === 0) {
          setFormData(prev => ({
            ...prev,
            selectedLRs: initialData.lrs
          }));
        }
      } catch (err) {
        console.error('Failed to fetch available LRs', err);
      } finally {
        setIsFetchingLRs(false);
      }
    };
    fetchLRs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleSelect = (vehicle) => {
    setFormData(prev => ({ ...prev, vehicle }));
  };

  const toggleLRSelection = (lr) => {
    setFormData(prev => {
      const isSelected = prev.selectedLRs.some(item => item.lrId === lr._id);
      if (isSelected) {
        return {
          ...prev,
          selectedLRs: prev.selectedLRs.filter(item => item.lrId !== lr._id)
        };
      } else {
        return {
          ...prev,
          selectedLRs: [...prev.selectedLRs, { lrId: lr._id, lrNumber: lr.lrNumber }]
        };
      }
    });
  };

  const filteredLRs = availableLRs.filter(lr => 
    lr.lrNumber.toLowerCase().includes(lrSearchQuery.toLowerCase()) ||
    lr.consignor?.name.toLowerCase().includes(lrSearchQuery.toLowerCase()) ||
    lr.consignee?.name.toLowerCase().includes(lrSearchQuery.toLowerCase()) ||
    lr.fromPlace.toLowerCase().includes(lrSearchQuery.toLowerCase()) ||
    lr.toPlace.toLowerCase().includes(lrSearchQuery.toLowerCase()) ||
    (lr.ewayBillNumber && lr.ewayBillNumber.toLowerCase().includes(lrSearchQuery.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.vehicle?._id) {
      setErrorMsg('Please select a vehicle and driver.');
      window.scrollTo(0, 0);
      return;
    }

    if (formData.selectedLRs.length === 0) {
      setErrorMsg('Please select at least one LR to load.');
      window.scrollTo(0, 0);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        vehicle: formData.vehicle._id,
        lrs: formData.selectedLRs
      };

      let res;
      if (isEditMode) {
        res = await updateLoading(initialData._id, payload);
        setSuccessMsg(`Loading Sheet ${res.data?.loadingNumber} updated successfully!`);
      } else {
        res = await createLoading(payload);
        setSuccessMsg(`Loading Sheet ${res.loading?.loadingNumber} created successfully!`);
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create loading sheet.');
      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── section heading helper ── */
  const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-3 mb-4 print:mb-1.5 mt-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-gray-400 whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-gray-100 print:bg-gray-300" />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden print:bg-transparent print:rounded-none print:border-none print:shadow-none">
      <style>{`
        @media print {
          @page { margin: 0; }
          body { 
            -webkit-print-color-adjust: exact; 
            margin: 10mm !important;
          }
        }
      `}</style>

      {/* ── Print header ── */}
      <div className="hidden print:flex justify-between items-end border-b-2 border-gray-800 pb-2 mb-4">
        <div className="flex items-center gap-3">
          <img src="/urtl-logo.png" alt="URTL" className="h-14 object-contain" />
          <div>
            <p className="text-xl font-black tracking-wider text-gray-900 leading-tight">URTL LOGISTICS</p>
            <p className="text-xs text-gray-500">Reliable &amp; Fast Delivery Services</p>
          </div>
        </div>
        <div className="text-right text-xs text-gray-600 space-y-0.5">
          <p><span className="font-semibold">Loading No:</span> <span className="text-red-600 font-bold text-sm">{formData.loadingNumber || '________'}</span></p>
          <p><span className="font-semibold">Date & Time:</span> {new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* ── Print only Info Section ── */}
      <div className="hidden print:flex justify-between items-center mb-4 border-b border-gray-400 pb-2">
        <p className="text-gray-800 text-sm"><span className="font-bold">Vehicle:</span> <span className="uppercase">{formData.vehicle?.vehicleNumber || '________'}</span></p>
        <p className="text-gray-800 text-sm"><span className="font-bold">Driver:</span> <span className="uppercase">{formData.vehicle?.driverName || '________'}</span></p>
        <p className="text-gray-800 text-sm"><span className="font-bold">From:</span> <span className="uppercase">{formData.fromPlace || '________'}</span></p>
        <p className="text-gray-800 text-sm"><span className="font-bold">To:</span> <span className="uppercase">{formData.toPlace || '________'}</span></p>
      </div>

      {/* ── Form header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 print:hidden">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-800">
            {isEditMode ? `Edit Loading Sheet: ${formData.loadingNumber}` : 'Create Loading Sheet'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{formData.branch}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 print:p-0 space-y-7 print:space-y-3">
        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 print:hidden">
            <p className="text-xs font-semibold mb-0.5">Error</p>
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-green-700 print:hidden">
            <p className="text-xs font-semibold mb-0.5">Success</p>
            <p className="text-sm">{successMsg}</p>
          </div>
        )}

        {/* ── Section 1: Basic details ── */}
        <div>
          <SectionHeading>Basic details</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden print:text-xs">
            <Field label="Loading Number">
              <input type="text" name="loadingNumber" className={inputCls} value={formData.loadingNumber} onChange={handleInputChange} placeholder="Generating…" />
            </Field>
            <Field label="Date *">
              <input type="date" name="date" required className={inputCls} value={formData.date} onChange={handleInputChange} />
            </Field>
            <Field label="From place *">
              <input type="text" name="fromPlace" required className={`${inputCls} uppercase`} value={formData.fromPlace} onChange={handleInputChange} />
            </Field>
            <Field label="To place *">
              <input type="text" name="toPlace" required className={`${inputCls} uppercase`} value={formData.toPlace} onChange={handleInputChange} />
            </Field>
          </div>
        </div>

        {/* ── Section 2: Vehicle & Driver ── */}
        <div className="border border-gray-200 rounded-xl p-4 print:p-0 print:border-none print:hidden">
          <div className="flex items-center justify-between mb-3 print:mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-gray-800">Vehicle Details</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal(true)}
              className="print:hidden inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Search className="w-3.5 h-3.5" strokeWidth={2} /> Select / Add Vehicle
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 print:gap-2">
            <Field label="Vehicle Number">
              <input type="text" readOnly className={readonlyCls} value={formData.vehicle?.vehicleNumber || ''} placeholder="Select vehicle..." />
            </Field>
            <Field label="Driver Name">
              <input type="text" readOnly className={readonlyCls} value={formData.vehicle?.driverName || ''} />
            </Field>
            <Field label="Driver Phone">
              <input type="text" readOnly className={readonlyCls} value={formData.vehicle?.driverPhone || ''} />
            </Field>
            <Field label="RC Number">
              <input type="text" readOnly className={readonlyCls} value={formData.vehicle?.rcNumber || ''} />
            </Field>
            <Field label="Vehicle Type">
              <input type="text" readOnly className={readonlyCls} value={formData.vehicle?.vehicleType || ''} />
            </Field>
            <Field label="License Number">
              <input type="text" readOnly className={readonlyCls} value={formData.vehicle?.driverLicense || ''} />
            </Field>
          </div>
        </div>

        {/* ── Section 3: Available LRs to Attach ── */}
        <div>
          <div className="flex items-center justify-between mb-3 print:hidden">
            <SectionHeading>Select LRs to Load</SectionHeading>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search LRs..."
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400"
                value={lrSearchQuery}
                onChange={(e) => setLrSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="hidden print:block mb-2">
            <h3 className="text-[10px] font-semibold text-gray-800 border-b border-gray-400 pb-1 uppercase">Loaded Lorry Receipts</h3>
          </div>

          <div className="border border-gray-200 print:border-gray-400 rounded-xl overflow-hidden print:rounded-sm">
            <div className="max-h-[350px] print:max-h-none overflow-y-auto print:overflow-visible">
              <table className="w-full text-left border-collapse table-fixed print:text-xs">
                <thead className="bg-gray-50 print:bg-transparent sticky top-0 z-10 shadow-sm print:shadow-none">
                  <tr>
                    <th className="p-2 print:p-1.5 w-10 text-center print:hidden border-b border-gray-200 print:border-gray-400">
                      <CheckSquare className="w-3.5 h-3.5 text-gray-400 mx-auto" />
                    </th>
                    <th className="p-2 print:p-1.5 font-semibold text-[10px] uppercase tracking-[0.07em] text-gray-400 border-b border-gray-200 print:border-gray-400 w-24">LR Number</th>
                    <th className="p-2 print:p-1.5 font-semibold text-[10px] uppercase tracking-[0.07em] text-gray-400 border-b border-gray-200 print:border-gray-400">From</th>
                    <th className="p-2 print:p-1.5 font-semibold text-[10px] uppercase tracking-[0.07em] text-gray-400 border-b border-gray-200 print:border-gray-400">To</th>
                    <th className="p-2 print:p-1.5 font-semibold text-[10px] uppercase tracking-[0.07em] text-gray-400 border-b border-gray-200 print:border-gray-400 w-16">Qty</th>
                    <th className="p-2 print:p-1.5 font-semibold text-[10px] uppercase tracking-[0.07em] text-gray-400 border-b border-gray-200 print:border-gray-400 w-20">Weight</th>
                    <th className="p-2 print:p-1.5 font-semibold text-[10px] uppercase tracking-[0.07em] text-gray-400 border-b border-gray-200 print:border-gray-400">Consignor</th>
                    <th className="p-2 print:p-1.5 font-semibold text-[10px] uppercase tracking-[0.07em] text-gray-400 border-b border-gray-200 print:border-gray-400">Consignee</th>
                    <th className="p-2 print:p-1.5 font-semibold text-[10px] uppercase tracking-[0.07em] text-gray-400 border-b border-gray-200 print:border-gray-400">E-Way Bill</th>
                    <th className="p-2 print:p-1.5 font-semibold text-[10px] uppercase tracking-[0.07em] text-gray-400 border-b border-gray-200 print:border-gray-400">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 print:divide-gray-300">
                  {isFetchingLRs ? (
                    <tr>
                      <td colSpan="10" className="p-6 text-center">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500 mx-auto mb-2" />
                        <p className="text-gray-500 text-xs">Fetching available LRs...</p>
                      </td>
                    </tr>
                  ) : filteredLRs.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="p-6 text-center text-gray-400 text-xs">
                        No available LRs found.
                      </td>
                    </tr>
                  ) : (
                    filteredLRs.map((lr) => {
                      const isSelected = formData.selectedLRs.some(item => item.lrId === lr._id);
                      const totalQty = lr.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                      const totalWeight = lr.items?.reduce((sum, item) => sum + (item.chargedWeight || 0), 0) || 0;
                      
                      return (
                        <tr 
                          key={lr._id} 
                          className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60 print:bg-transparent' : 'print:hidden'}`}
                          onClick={() => toggleLRSelection(lr)}
                        >
                          <td className="p-2 print:p-1.5 text-center print:hidden border-r border-gray-100">
                            <input
                              type="checkbox"
                              className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300"
                              checked={isSelected}
                              onChange={() => {}} 
                            />
                          </td>
                          <td className="p-2 print:p-1.5 font-medium text-gray-800 text-[12px] print:text-[10px] border-r border-gray-100 print:border-gray-300">{lr.lrNumber}</td>
                          <td className="p-2 print:p-1.5 text-[12px] print:text-[10px] text-gray-600 border-r border-gray-100 print:border-gray-300 truncate">{lr.fromPlace}</td>
                          <td className="p-2 print:p-1.5 text-[12px] print:text-[10px] text-gray-600 border-r border-gray-100 print:border-gray-300 truncate">{lr.toPlace}</td>
                          <td className="p-2 print:p-1.5 text-[12px] print:text-[10px] text-gray-600 border-r border-gray-100 print:border-gray-300">{totalQty}</td>
                          <td className="p-2 print:p-1.5 text-[12px] print:text-[10px] text-gray-600 border-r border-gray-100 print:border-gray-300">{totalWeight} kg</td>
                          <td className="p-2 print:p-1.5 text-[12px] print:text-[10px] text-gray-600 truncate border-r border-gray-100 print:border-gray-300">{lr.consignor?.name || '-'}</td>
                          <td className="p-2 print:p-1.5 text-[12px] print:text-[10px] text-gray-600 truncate border-r border-gray-100 print:border-gray-300">{lr.consignee?.name || '-'}</td>
                          <td className="p-2 print:p-1.5 text-[12px] print:text-[10px] text-gray-600 truncate border-r border-gray-100 print:border-gray-300">{lr.ewayBillNumber || '-'}</td>
                          <td className="p-2 print:p-1.5 text-[12px] print:text-[10px] text-gray-600 truncate">{lr.remarks || '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-2 flex justify-end text-[11px] font-semibold text-blue-600 print:hidden">
            Selected LRs: {formData.selectedLRs.length}
          </div>
        </div>

        {/* ── Print Footer ── */}
        <div className="hidden print:block mt-4 border-t-2 border-gray-800 pt-6 break-inside-avoid">
          <div className="flex justify-between items-end">
            <div className="w-1/3">
              <div className="border-b-2 border-dashed border-gray-400 w-3/4" />
              <p className="text-[10px] font-semibold text-gray-700 mt-2">Driver's Signature</p>
            </div>
            <div className="w-1/3 text-right">
              <div className="border-b border-gray-800 w-3/4 ml-auto" />
              <p className="text-[10px] font-semibold text-gray-700 mt-2 mb-0.5">For URTL LOGISTICS</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="print:hidden flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" strokeWidth={1.75} /> Print
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.75} /> Reset
          </button>
          <button
            type="submit"
            disabled={isLoading || isFetchingLRs}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              : <Save className="w-4 h-4" strokeWidth={2} />}
            {isLoading
              ? (isEditMode ? 'Updating…' : 'Saving…')
              : (isEditMode ? 'Update Loading Sheet' : 'Save Loading Sheet')}
          </button>
        </div>
      </form>

      <VehicleModal
        isOpen={activeModal}
        onClose={() => setActiveModal(false)}
        onSelect={handleVehicleSelect}
        searchApi={searchVehicles}
        createApi={createVehicle}
      />
    </div>
  );
};

export default LoadingForm;
