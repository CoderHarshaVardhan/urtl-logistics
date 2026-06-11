import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LRForm from '../../components/LR/LRForm';
import { getNextLRNumber, getLRById } from '../../services/lr.service';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const LRPage = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (id) {
          const res = await getLRById(id);
          setInitialData(res.data);
        } else {
          const res = await getNextLRNumber();
          setInitialData({ lrNumber: res.lrNumber });
        }
      } catch (err) {
        console.error('Failed to initialize LR', err);
        setError('Could not initialize workspace. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-gray-400 font-medium">
          Initializing Lorry Receipt workspace…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white border border-red-100 rounded-2xl p-8 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" strokeWidth={1.75} />
        </div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Initialization failed</h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={1.75} />
          Refresh page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Page header */}
      <div className="mb-5 print:hidden">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            {id ? 'Edit Lorry Receipt' : 'Lorry Receipt (LR)'}
          </h1>
          {initialData?.lrNumber && (
            <span className="text-sm text-gray-400 font-mono">{initialData.lrNumber}</span>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-0.5">
          {id
            ? `Editing LR — ${initialData?.lrNumber}`
            : 'Create a new lorry receipt for your branch'}
        </p>
      </div>

      <LRForm initialData={initialData} />
    </div>
  );
};

export default LRPage;