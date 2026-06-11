import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingForm from '../../components/Loading/LoadingForm';
import { getNextLoadingNumber, getLoadingById } from '../../services/loading.service';
import { Loader2, AlertCircle } from 'lucide-react';

const LoadingPage = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (id) {
          const res = await getLoadingById(id);
          setInitialData(res.data);
        } else {
          const res = await getNextLoadingNumber();
          setInitialData({ loadingNumber: res.loadingNumber });
        }
      } catch (err) {
        console.error('Failed to initialize Loading', err);
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
          Initializing Loading Sheet workspace…
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
            {id ? 'Edit Loading Sheet' : 'Loading Sheet'}
          </h1>
          {initialData?.loadingNumber && (
            <span className="text-sm text-gray-400 font-mono">{initialData.loadingNumber}</span>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-0.5">
          {id
            ? `Editing Loading Sheet — ${initialData?.loadingNumber}`
            : 'Create a new loading sheet and attach LRs for your branch'}
        </p>
      </div>

      <LoadingForm initialData={initialData} />
    </div>
  );
};

export default LoadingPage;
