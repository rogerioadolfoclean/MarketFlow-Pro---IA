
import React, { useState } from 'react';
import { MarketItem, ShoppingList } from '../types';
import { smartCategorize } from '../services/geminiService';

interface ListManagerProps {
  lists: ShoppingList[];
  onDeleteList: (id: string) => void;
  onUpdateList: (list: ShoppingList) => void;
  onAddList: (title: string) => void;
}

const ListManager: React.FC<ListManagerProps> = ({ lists, onDeleteList, onUpdateList, onAddList }) => {
  const [newListTitle, setNewListTitle] = useState('');
  const [manualItem, setManualItem] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(lists.length > 0 ? lists[0].id : null);
  const [isCategorizing, setIsCategorizing] = useState(false);

  const activeList = lists.find(l => l.id === selectedListId);

  const handleAddManualItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualItem.trim() || !activeList) return;

    setIsCategorizing(true);
    try {
      const categorized = await smartCategorize([manualItem]);
      if (categorized.length > 0) {
        const updatedItems = [...activeList.items, categorized[0]];
        onUpdateList({ ...activeList, items: updatedItems });
        setManualItem('');
      }
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    onAddList(newListTitle);
    setNewListTitle('');
  };

  const removeItem = (itemId: string) => {
    if (!activeList) return;
    const updatedItems = activeList.items.filter(i => i.id !== itemId);
    onUpdateList({ ...activeList, items: updatedItems });
  };

  // Fix: Explicitly type groupedItems as Record<string, MarketItem[]> to ensure correct inference in Object.entries
  const groupedItems: Record<string, MarketItem[]> = activeList?.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MarketItem[]>) || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* List Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Mes Listes</h2>
        
        <form onSubmit={handleCreateList} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nouvelle liste..." 
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <button 
            type="submit"
            className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors"
          >
            <i className="fas fa-plus"></i>
          </button>
        </form>

        <div className="space-y-2">
          {lists.map(list => (
            <div 
              key={list.id}
              onClick={() => setSelectedListId(list.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${selectedListId === list.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-300'}`}
            >
              <div className="flex items-center gap-3">
                <i className={`fas ${selectedListId === list.id ? 'fa-folder-open' : 'fa-folder'} opacity-70`}></i>
                <span className="font-medium">{list.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedListId === list.id ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                  {list.items.length}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteList(list.id); }}
                  className={`opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-1`}
                >
                  <i className="fas fa-trash-alt text-sm"></i>
                </button>
              </div>
            </div>
          ))}
          {lists.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              <i className="fas fa-clipboard-list text-3xl mb-3"></i>
              <p className="text-sm">Aucune liste créée</p>
            </div>
          )}
        </div>
      </div>

      {/* List Detail View */}
      <div className="lg:col-span-8">
        {activeList ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{activeList.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Créée le {new Date(activeList.createdAt).toLocaleDateString()}</p>
              </div>
              <form onSubmit={handleAddManualItem} className="flex gap-2 max-w-xs w-full">
                <input 
                  type="text" 
                  placeholder="Ajouter un article..."
                  value={manualItem}
                  onChange={(e) => setManualItem(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <button 
                  disabled={isCategorizing || !manualItem.trim()}
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isCategorizing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-plus"></i>}
                </button>
              </form>
            </div>

            <div className="p-6 space-y-8 flex-grow overflow-auto">
              {Object.entries(groupedItems).length > 0 ? (
                Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600/70 border-b border-emerald-50 pb-2">{category}</h4>
                    <div className="space-y-2">
                      {/* items is now correctly inferred as MarketItem[] */}
                      {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-emerald-200 rounded flex items-center justify-center text-emerald-500 hover:bg-emerald-50 cursor-pointer">
                              <i className="fas fa-check text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                            </div>
                            <span className="text-slate-700 font-medium">{item.name}</span>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 opacity-30">
                  <i className="fas fa-shopping-cart text-6xl mb-4"></i>
                  <p className="font-medium">Votre liste est vide.</p>
                  <p className="text-sm">Ajoutez des articles depuis l'onglet Tendances.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                onClick={() => window.print()} 
                className="text-sm text-slate-500 hover:text-emerald-600 font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <i className="fas fa-print"></i>
                Imprimer ou partager
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">Sélectionnez une liste pour voir les détails.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListManager;
