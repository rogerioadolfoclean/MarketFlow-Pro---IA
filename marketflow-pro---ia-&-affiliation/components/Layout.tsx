
import React from 'react';
import { UserProfile, AppStats } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'trends' | 'lists' | 'settings' | 'dashboard';
  setActiveTab: (tab: any) => void;
  user: UserProfile;
  stats?: AppStats;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, stats }) => {
  const getDbStatusColor = () => {
    switch (stats?.dbStatus) {
      case 'synced': return 'text-emerald-500';
      case 'connecting': return 'text-amber-500 animate-pulse';
      case 'error': return 'text-red-500';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-100">
            <i className="fas fa-rocket"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">MarketFlow</h1>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <button 
            onClick={() => setActiveTab('trends')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'trends' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fas fa-globe-americas w-5"></i>
            Explorateur
          </button>
          <button 
            onClick={() => setActiveTab('lists')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'lists' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fas fa-layer-group w-5"></i>
            Mes Listes
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fas fa-wallet w-5"></i>
            Portefeuille
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fas fa-cog w-5"></i>
            Réglages
          </button>
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase">Cloud Sync</span>
            <i className={`fas fa-cloud-upload-alt text-xs ${getDbStatusColor()}`}></i>
          </div>
          <div className="flex items-center gap-3">
            <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-indigo-200" alt="avatar" />
            <div className="overflow-hidden">
              <p className="text-xs font-black text-slate-800 truncate">{user.name}</p>
              <p className="text-[10px] text-indigo-500 font-bold uppercase">{user.level}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-slate-800 capitalize">
              {activeTab === 'trends' ? 'Tendance Mondiale' : activeTab}
            </h2>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">
              <span>{stats?.dbStatus === 'synced' ? 'Database Connected' : 'Syncing...'}</span>
              <i className="fas fa-database ml-1"></i>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Utilisateur</span>
              <span className="text-sm font-black text-slate-800">{user.email}</span>
            </div>
            <button className="relative w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-4 z-50">
        <button onClick={() => setActiveTab('trends')} className={`flex flex-col items-center gap-1 ${activeTab === 'trends' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-search"></i>
          <span className="text-[10px] font-bold">Explorer</span>
        </button>
        <button onClick={() => setActiveTab('lists')} className={`flex flex-col items-center gap-1 ${activeTab === 'lists' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-box"></i>
          <span className="text-[10px] font-bold">Listes</span>
        </button>
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-wallet"></i>
          <span className="text-[10px] font-bold">Gains</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
