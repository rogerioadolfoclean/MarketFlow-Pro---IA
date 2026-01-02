
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TrendExplorer from './components/TrendExplorer';
import ListManager from './components/ListManager';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import { dbService } from './services/dbService';
import { ShoppingList, MarketItem, AffiliateConfig, AppStats, UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trends' | 'lists' | 'settings' | 'dashboard'>('trends');
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [currentUser] = useState<UserProfile>({
    id: 'u-1',
    name: 'M. Ibrahim',
    email: 'contact@ibrahim-market.com',
    avatar: 'https://ui-avatars.com/api/?name=Ibrahim&background=6366f1&color=fff',
    role: 'admin',
    memberSince: 'Jan 2024',
    level: 'Membre Platinum'
  });

  const [stats, setStats] = useState<AppStats>({ 
    totalClicks: 0, 
    estimatedEarnings: 0,
    stripeBalance: 1245.80,
    lastPayout: null,
    dbStatus: 'connecting'
  });
  
  const [affiliateConfig, setAffiliateConfig] = useState<AffiliateConfig>({
    amazonTag: '',
    ebayTag: '',
    aliExpressTag: '',
    walmartTag: '',
    rakutenTag: '',
    temuTag: '',
    stripeAccountId: 'acct_1SkugqBdk3mr8tjW',
    stripePublicKey: '',
    stripeSecretKey: ''
  });

  // Chargement Initial
  useEffect(() => {
    const loadAllData = async () => {
      const savedLists = await dbService.getLists();
      const savedConfig = await dbService.getConfig();
      const savedStats = await dbService.getStats();

      if (savedLists) setLists(savedLists);
      if (savedConfig) setAffiliateConfig(savedConfig);
      if (savedStats) {
        setStats({ ...savedStats, dbStatus: 'synced' });
      } else {
        setStats(prev => ({ ...prev, dbStatus: 'synced' }));
      }
      setIsInitialLoad(false);
    };

    loadAllData();
  }, []);

  // Sauvegarde automatique lors des changements
  useEffect(() => {
    if (isInitialLoad) return;
    
    const saveData = async () => {
      setStats(prev => ({ ...prev, dbStatus: 'connecting' }));
      await dbService.saveLists(lists);
      await dbService.saveConfig(affiliateConfig);
      await dbService.saveStats(stats);
      setStats(prev => ({ ...prev, dbStatus: 'synced' }));
    };

    const timer = setTimeout(saveData, 1000);
    return () => clearTimeout(timer);
  }, [lists, affiliateConfig, stats, isInitialLoad]);

  const handleTrackClick = () => {
    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      estimatedEarnings: prev.estimatedEarnings + 0.65,
      stripeBalance: prev.stripeBalance + 0.12
    }));
  };

  const addToList = (item: MarketItem) => {
    let targetListId = lists.length > 0 ? lists[0].id : '1';
    
    const itemToAdd = { ...item, id: `${item.id}-${Date.now()}` };

    if (lists.length === 0) {
      setLists([{ id: '1', title: 'Ma Liste de Veille', items: [itemToAdd], createdAt: Date.now() }]);
    } else {
      setLists(lists.map(l => l.id === targetListId ? { ...l, items: [...l.items, itemToAdd] } : l));
    }
    
    setActiveTab('lists');
  };

  return (
    <Layout user={currentUser} activeTab={activeTab as any} setActiveTab={(tab) => setActiveTab(tab as any)} stats={stats}>
      {activeTab === 'trends' && <TrendExplorer onAddToList={addToList} affiliateConfig={affiliateConfig} onTrackClick={handleTrackClick} />}
      {activeTab === 'lists' && (
        <ListManager 
          lists={lists} 
          onDeleteList={(id) => setLists(lists.filter(l => l.id !== id))}
          onUpdateList={(updated) => setLists(lists.map(l => l.id === updated.id ? updated : l))}
          onAddList={(title) => setLists([{ id: Date.now().toString(), title, items: [], createdAt: Date.now() }, ...lists])}
        />
      )}
      {activeTab === 'settings' && <Settings config={affiliateConfig} setConfig={setAffiliateConfig} onGoToDashboard={() => setActiveTab('dashboard')} />}
      {activeTab === 'dashboard' && <Dashboard stats={stats} config={affiliateConfig} />}
    </Layout>
  );
};

export default App;
