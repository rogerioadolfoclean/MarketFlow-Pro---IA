
import React from 'react';
import { AppStats, AffiliateConfig } from '../types';

interface DashboardProps {
  stats: AppStats;
  config: AffiliateConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, config }) => {
  const stripeDashboardUrl = `https://dashboard.stripe.com/${config.stripeAccountId || 'acct_1SkugqBdk3mr8tjW'}/test/dashboard`;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Stripe Wallet Card */}
        <div className="flex-1 stripe-gradient p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/30">
                Stripe Enterprise <i className="fas fa-shield-alt ml-1"></i>
              </div>
              <i className="fab fa-stripe text-4xl opacity-80"></i>
            </div>
            <p className="opacity-70 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Solde Net Disponible</p>
            <h3 className="text-6xl font-black mb-10 tracking-tighter">
              {stats.stripeBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm hover:shadow-xl hover:scale-105 transition-all">
                Demander un virement
              </button>
              <a 
                href={stripeDashboardUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/20 hover:bg-black/40 px-6 py-4 rounded-2xl font-black text-xs backdrop-blur-sm transition-all flex items-center gap-2"
              >
                Explorer Stripe <i className="fas fa-external-link-alt text-[10px]"></i>
              </a>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:scale-110 transition-transform duration-1000">
            <i className="fas fa-vault text-[25rem]"></i>
          </div>
        </div>

        {/* Database Health Monitor */}
        <div className="lg:w-96 bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">PostgreSQL Status</h4>
            <div className={`w-3 h-3 rounded-full ${stats.dbStatus === 'synced' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`}></div>
          </div>
          
          <div className="space-y-6 flex-grow">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Enregistrements</p>
                <p className="text-2xl font-black text-slate-800">2,842</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Latence</p>
                <p className="text-sm font-black text-emerald-500">24ms</p>
              </div>
            </div>
            
            <div className="h-24 flex items-end gap-1 px-1">
              {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55].map((h, i) => (
                <div 
                  key={i} 
                  style={{ height: `${h}%` }} 
                  className={`flex-1 rounded-t-sm ${i === 11 ? 'bg-indigo-600' : 'bg-slate-100 group-hover:bg-indigo-100'} transition-colors duration-500`}
                ></div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-50">
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                <i className="fas fa-info-circle mr-1"></i>
                Synchronisation temps réel activée. Vos données sont répliquées sur 3 nœuds mondiaux.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <i className="fas fa-mouse-pointer"></i>
          </div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Clics Affiliés</p>
          <h4 className="text-3xl font-black text-slate-800">{stats.totalClicks}</h4>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <i className="fas fa-chart-pie"></i>
          </div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Conversion Moyenne</p>
          <h4 className="text-3xl font-black text-slate-800">5.8%</h4>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-amber-200 transition-colors group">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <i className="fas fa-coins"></i>
          </div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Revenus IA (24h)</p>
          <h4 className="text-3xl font-black text-slate-800">{(stats.estimatedEarnings).toFixed(2)}€</h4>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
