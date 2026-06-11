import React, { useEffect, useState } from 'react';
import { getLoadings } from '../../services/loading.service';
import { Loader2, AlertCircle, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 50;

const LoadingInvoicesPage = () => {
  const [loadings, setLoadings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoadings = async () => {
      try {
        const response = await getLoadings();
        setLoadings(response.data);
      } catch (err) {
        console.error('Failed to fetch Loading Sheets', err);
        setError('Could not load Loading Sheets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoadings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" strokeWidth={1.75} />
        <p className="text-sm text-gray-400 font-medium">Loading loading sheets…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white border border-red-100 rounded-2xl p-8 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" strokeWidth={1.75} />
        </div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Failed to load</h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={1.75} /> Refresh page
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(loadings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLoadings = loadings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Loading Sheets</h1>
        <p className="text-sm text-gray-400 mt-0.5">All generated loading sheets for your branch</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                {['Loading Number', 'Date', 'Vehicle', 'From', 'To', 'LRs Count', ''].map((h, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 bg-gray-50/60 ${i === 5 ? 'text-center' : ''} ${i === 6 ? 'w-20' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedLoadings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FileText className="w-10 h-10 stroke-1" />
                      <p className="text-sm font-medium">No loading sheets yet</p>
                      <p className="text-xs text-gray-400">Create one from the Loading menu to see it here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLoadings.map((loading) => (
                  <tr
                    key={loading._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-semibold text-blue-700 font-mono">{loading.loadingNumber}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {new Date(loading.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-700 max-w-[180px] truncate">
                      {loading.vehicle?.vehicleNumber || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 tracking-wide">
                        {loading.fromPlace}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 tracking-wide">
                        {loading.toPlace}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-[13px] font-semibold text-gray-800">
                      {loading.lrs?.length || 0}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => navigate(`/dashboard/loading/${loading._id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Open <ArrowRight className="w-3 h-3" strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, loadings.length)} of {loadings.length} records
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-3 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-gray-400 px-1">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 px-3 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingInvoicesPage;
