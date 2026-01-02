
import React, { useState, useEffect } from 'react';
import { getMarketTrends } from '../services/geminiService';
import { TrendAnalysis, MarketItem, AffiliateConfig } from '../types';

interface TrendExplorerProps {
  onAddToList: (item: MarketItem) => void;
  affiliateConfig: AffiliateConfig;
  onTrackClick: () => void;
}

const TrendExplorer: React.FC<TrendExplorerProps> = ({ onAddToList, affiliateConfig, onTrackClick }) => {
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarketTrends();
      setAnalysis(data);
    } catch (err) {
      setError("Connexion au réseau MarketFlow impossible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-12 pb-24">
      {/* Community Horizontal Scroll */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <i className="fas fa-users text-indigo-600"></i>
            Populaire dans la Communauté
          </h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg animate-pulse">
            {Math.floor(Math.random() * 500 + 100)} en ligne
          </span>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {analysis?.communityPicks.map((pick) => (
            <div key={pick.id} className="flex-shrink-0 w-64 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{pick.category}</span>
                <div className="flex items-center gap-1 text-rose-500 text-[10px] font-bold">
                  <i className="fas fa-heart"></i> {pick.viewCount ? Math.floor(pick.viewCount/10) : 0}
                </div>
              </div>
              <h4 className="font-black text-slate-800 mb-2 truncate group-hover:text-indigo-600 transition-colors">{pick.name}</h4>
              <p className="text-lg font-black text-indigo-600 mb-4">{pick.priceEstimate}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                <i className="fas fa-eye"></i> {pick.viewCount} vues
              </div>
            </div>
          ))}
          {!analysis && loading && [1,2,3,4].map(i => (
            <div key={i} className="flex-shrink-0 w-64 h-40 bg-slate-100 rounded-[2rem] animate-pulse"></div>
          ))}
        </div>
      </section>

      {/* Main Trends Grid */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Analyse des Meilleures Ventes</h2>
            <p className="text-slate-500 font-medium">Données agrégées de millions de transactions mondiales.</p>
          </div>
          <button onClick={fetchData} disabled={loading} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3">
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            Scanner le Monde
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Synchronisation des serveurs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analysis?.trendingItems.map(item => (
              <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative">
                <div className="flex justify-between mb-6">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-lg">{item.category}</span>
                  <div className="text-indigo-600 text-[10px] font-black uppercase flex items-center gap-1">
                    <i className="fas fa-chart-line"></i> {item.viewCount} scans
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                <p className="text-slate-500 text-xs mb-6 line-clamp-2 leading-relaxed">{item.reason}</p>

                <div className="bg-slate-50 p-4 rounded-2xl mb-8 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Meilleur Prix</span>
                  <span className="text-lg font-black text-slate-900">{item.priceEstimate}</span>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => window.open(item.buyUrl, '_blank')}
                    className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-50 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-shopping-cart text-sm"></i> Acheter
                  </button>
                  <button 
                    onClick={() => onAddToList(item)}
                    className="w-14 h-14 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TrendExplorer;
