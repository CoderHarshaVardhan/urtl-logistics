import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Truck, FileText, Activity, PlusCircle, ArrowRight, Package, Clock } from 'lucide-react';
import { getLRs } from '../services/lr.service';

const Dashboard = () => {
  const { user } = useAuth();
  const [lrs, setLRs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLRs();
        // Assuming response.data is an array of LRs, sorted by newest first
        setLRs(response.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get 5 most recent LRs
  const recentLRs = lrs.slice(0, 5);
  // Calculate total revenue from all LRs
  const totalRevenue = lrs.reduce((sum, lr) => sum + (lr.totalAmount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-20 -mb-10 w-32 h-32 bg-indigo-300 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome back, {user?.name}! 👋</h1>
            <p className="text-blue-100 text-lg max-w-2xl font-medium">
              You are logged into the <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">{user?.branch}</span> branch. Have a great day managing your logistics.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/lr" className="inline-flex items-center px-4 py-2.5 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-50 hover:scale-105 transition-all duration-200">
              <PlusCircle className="w-5 h-5 mr-2" />
              New LR
            </Link>
            <Link to="/dashboard/loading" className="inline-flex items-center px-4 py-2.5 bg-blue-800/50 text-white font-bold rounded-xl border border-blue-400/30 hover:bg-blue-800/80 backdrop-blur-sm hover:scale-105 transition-all duration-200">
              <Truck className="w-5 h-5 mr-2" />
              New Load
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-md border border-blue-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group cursor-default">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-100/80 px-2.5 py-1 rounded-full shadow-sm">+Active</span>
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Lorry Receipts</h3>
          <p className="text-3xl font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 drop-shadow-sm">
            {isLoading ? <span className="animate-pulse bg-blue-200/50 rounded w-16 h-8 inline-block"></span> : lrs.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 shadow-md border border-emerald-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group cursor-default">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</h3>
          <p className="text-3xl font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 drop-shadow-sm">
            {isLoading ? <span className="animate-pulse bg-emerald-200/50 rounded w-24 h-8 inline-block"></span> : `₹${totalRevenue.toLocaleString()}`}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 shadow-md border border-orange-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group cursor-default">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pending Loads</h3>
          <p className="text-3xl font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 drop-shadow-sm">
            {isLoading ? <span className="animate-pulse bg-orange-200/50 rounded w-12 h-8 inline-block"></span> : lrs.filter(lr => !lr.isLoaded).length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 shadow-md border border-indigo-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group cursor-default">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <span className="flex h-3 w-3 relative shadow-sm rounded-full">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">System Status</h3>
          <p className="text-3xl font-extrabold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300 drop-shadow-sm">Online</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent LRs Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100/80 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Recent Lorry Receipts</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Latest generated receipts from your branch</p>
            </div>
            <Link to="/dashboard/invoices" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center group bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
              View All <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-blue-400">
                <Clock className="w-10 h-10 mb-3 animate-spin" />
                <p className="font-medium text-gray-500">Loading recent data...</p>
              </div>
            ) : recentLRs.length === 0 ? (
              <div className="p-12 text-center text-gray-500 bg-gray-50/50">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No lorry receipts generated yet.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5 font-bold">LR No</th>
                    <th className="p-5 font-bold">Date</th>
                    <th className="p-5 font-bold">Destination</th>
                    <th className="p-5 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLRs.map((lr) => (
                    <tr key={lr._id} className="border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors group">
                      <td className="p-5">
                        <Link to={`/dashboard/lr/${lr._id}`} className="font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></span>
                          {lr.lrNumber}
                        </Link>
                      </td>
                      <td className="p-5 text-sm text-gray-600 font-semibold">
                        {new Date(lr.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-5 text-sm">
                        <span className="text-gray-500 font-medium">{lr.fromPlace}</span>
                        <span className="mx-2 text-blue-300 font-bold">→</span>
                        <span className="font-bold text-gray-800">{lr.toPlace}</span>
                      </td>
                      <td className="p-5 text-sm text-right font-black text-gray-900">
                        <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">
                          ₹{lr.totalAmount?.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Links / Helper */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-blue-900/50">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-2xl font-extrabold mb-6 relative z-10 tracking-tight flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Quick Actions</span>
          </h2>
          
          <div className="space-y-4 relative z-10">
            <Link to="/dashboard/lr" className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 transition-all duration-300 rounded-2xl p-5 group hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center text-blue-400 group-hover:text-blue-300 mb-2 transition-colors">
                <FileText className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg text-white">Create Lorry Receipt</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Generate a new LR with consignment items and calculate charges.</p>
            </Link>

            <Link to="/dashboard/loading" className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 rounded-2xl p-5 group hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center text-indigo-400 group-hover:text-indigo-300 mb-2 transition-colors">
                <Truck className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg text-white">Create Loading Sheet</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Attach unassigned LRs to a vehicle and generate a loading sheet.</p>
            </Link>

            <Link to="/dashboard/invoices" className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 transition-all duration-300 rounded-2xl p-5 group hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center text-emerald-400 group-hover:text-emerald-300 mb-2 transition-colors">
                <Activity className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg text-white">View All Invoices</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">Search and print historical lorry receipts.</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
