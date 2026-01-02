
import { ShoppingList, AffiliateConfig, AppStats } from '../types';

/**
 * dbService : Le cerveau du stockage.
 * Prêt pour l'intégration Vercel Postgres.
 */

const STORAGE_KEYS = {
  LISTS: 'market_flow_lists',
  CONFIG: 'market_flow_affiliate',
  STATS: 'market_flow_stats'
};

export const dbService = {
  async delay(ms = 600) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async saveLists(lists: ShoppingList[]): Promise<boolean> {
    console.log("PostgreSQL Sync: Saving lists...");
    await this.delay(800);
    try {
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
      return true;
    } catch (e) {
      console.error("Database Error:", e);
      return false;
    }
  },

  async getLists(): Promise<ShoppingList[]> {
    await this.delay(400);
    const data = localStorage.getItem(STORAGE_KEYS.LISTS);
    return data ? JSON.parse(data) : [];
  },

  async saveConfig(config: AffiliateConfig): Promise<boolean> {
    await this.delay(300);
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    return true;
  },

  async getConfig(): Promise<AffiliateConfig | null> {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return data ? JSON.parse(data) : null;
  },

  async saveStats(stats: AppStats): Promise<boolean> {
    await this.delay(200);
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    return true;
  },

  async getStats(): Promise<AppStats | null> {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : null;
  }
};
