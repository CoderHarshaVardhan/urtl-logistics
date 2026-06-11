import React, { useEffect, useState } from 'react';
import { getLRs } from '../../services/lr.service';
import { Loader2, AlertCircle, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 50;

const InvoicesPage = () => {
  const [lrs, setLRs]           = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLRs = async () => {
      try {
        const response = await getLRs();
        setLRs(response.data);
      } catch (err) {
        console.error('Failed to fetch LRs', err);
        setError('Could not load Lorry Receipts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLRs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" strokeWidth={1.75} />
        <p className="text-sm text-gray-400 font-medium">Loading lorry receipts…</p>
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

  const totalPages    = Math.ceil(lrs.length / ITEMS_PER_PAGE);
  const startIndex    = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLRs  = lrs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-[1400px] mx-auto">

      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Lorry Receipts</h1>
        <p className="text-sm text-gray-400 mt-0.5">All generated lorry receipts for your branch</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                {['LR Number', 'Date', 'From', 'To', 'Consignor', 'Total (₹)', ''].map((h, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 bg-gray-50/60 ${i === 5 ? 'text-right' : ''} ${i === 6 ? 'w-20' : ''}`}
                  >{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedLRs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FileText className="w-10 h-10 stroke-1" />
                      <p className="text-sm font-medium">No lorry receipts yet</p>
                      <p className="text-xs text-gray-400">Create one from the LR menu to see it here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLRs.map((lr) => (
                  <tr
                    key={lr._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-semibold text-blue-700 font-mono">{lr.lrNumber}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">
                      {new Date(lr.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 tracking-wide">
                        {lr.fromPlace}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 tracking-wide">
                        {lr.toPlace}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-700 max-w-[180px] truncate">
                      {lr.consignor?.name || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right text-[13px] font-semibold text-gray-800">
                      ₹{lr.totalAmount?.toLocaleString('en-IN') ?? '—'}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => navigate(`/dashboard/lr/${lr._id}`)}
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
              {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, lrs.length)} of {lrs.length} records
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

export default InvoicesPage;