
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'vendor' | 'user';
  memberSince: string;
  level: string;
}

export interface AffiliateConfig {
  amazonTag: string;
  ebayTag: string;
  aliExpressTag: string;
  walmartTag: string;
  rakutenTag: string;
  temuTag: string;
  stripeAccountId: string;
  stripePublicKey: string;
  stripeSecretKey: string;
}

export interface PriceComparison {
  platform: string;
  price: string;
  url: string;
}

export interface MarketItem {
  id: string;
  name: string;
  category: string;
  reason: string;
  priceEstimate?: string;
  popularityScore: number;
  sourcePlatform?: string;
  buyUrl?: string;
  comparisons?: PriceComparison[];
  isHotDeal?: boolean;
  viewCount?: number;
  likeCount?: number;
}

export interface ShoppingList {
  id: string;
  title: string;
  items: MarketItem[];
  createdAt: number;
  isPublic?: boolean;
  authorId?: string;
  lastSyncedAt?: number;
}

export interface TrendAnalysis {
  trendingItems: MarketItem[];
  communityPicks: MarketItem[];
  categories: string[];
  lastUpdated: number;
  sources: { title: string; uri: string }[];
}

export interface AppStats {
  totalClicks: number;
  estimatedEarnings: number;
  stripeBalance: number;
  lastPayout: string | null;
  dbStatus: 'local' | 'synced' | 'connecting' | 'error';
}
