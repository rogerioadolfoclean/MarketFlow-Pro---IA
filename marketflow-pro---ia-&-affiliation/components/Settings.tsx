
import React from 'react';
import { AffiliateConfig } from '../types';

interface SettingsProps {
  config: AffiliateConfig;
  setConfig: (config: AffiliateConfig) => void;
  onGoToDashboard: () => void;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig, onGoToDashboard }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-4">Centre d'Affaires</h2>
          <p className="opacity-70 leading-relaxed font-medium mb-6">
            Gérez vos revenus passifs et votre intégration de paiement Stripe.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onGoToDashboard}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-500 transition-all flex items-center gap-2"
            >
              <i className="fas fa-wallet"></i>
              Portefeuille & Gains
            </button>
            <a 
              href={`https://dashboard.stripe.com/${config.stripeAccountId}/test/dashboard`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2"
            >
              <i className="fab fa-stripe-s"></i>
              Tableau de Bord Stripe
            </a>
          </div>
        </div>
        <i className="fab fa-stripe absolute -right-4 -bottom-4 text-[12rem] opacity-5"></i>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-8">
        {/* Section Stripe */}
        <div>
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <i className="fab fa-stripe text-blue-600 text-2xl"></i>
            Configuration Stripe Connect
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block md:col-span-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">ID du Compte Stripe</span>
              <input 
                type="text" name="stripeAccountId" value={config.stripeAccountId} onChange={handleChange}
                placeholder="ex: acct_1SkugqBdk3mr8tjW"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono font-medium transition-all"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Clé Publique (Publishable Key)</span>
              <input 
                type="password" name="stripePublicKey" value={config.stripePublicKey} onChange={handleChange}
                placeholder="pk_test_..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Clé Secrète (Secret Key)</span>
              <input 
                type="password" name="stripeSecretKey" value={config.stripeSecretKey} onChange={handleChange}
                placeholder="sk_test_..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
              />
            </label>
          </div>
        </div>

        {/* Section Affiliation */}
        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-6">Tags Partenaires Mondiaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 mb-2">
                <i className="fab fa-amazon text-amber-500"></i> Amazon Associate Tag
              </span>
              <input 
                type="text" name="amazonTag" value={config.amazonTag} onChange={handleChange}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium transition-all"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 mb-2">
                <i className="fab fa-ebay text-blue-500"></i> eBay Campaign ID
              </span>
              <input 
                type="text" name="ebayTag" value={config.ebayTag} onChange={handleChange}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium transition-all"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
