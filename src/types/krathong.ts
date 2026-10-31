export interface KrathongBaseOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tag: string;
  primaryColor: string;
  ecoRating: number; // 1-5 stars
}

export interface CandleColorOption {
  id: string;
  name: string;
  candleColor: string;
  flameColor: string;
  glowColor: string;
  meaning: string;
}

export interface IncenseOption {
  id: string;
  name: string;
  scent: string;
  meaning: string;
}

export interface FlowerOption {
  id: string;
  name: string;
  color: string;
  meaning: string;
}

export interface WishCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  presets: string[];
}

export interface KrathongCustomization {
  baseId: string;
  candleColorId: string;
  incenseId: string;
  flowers: string[]; // array of flower IDs
  includeCoins: boolean;
  senderName: string;
  wishCategory: string;
  wishMessage: string;
  isAnonymous: boolean;
}

export interface FloatingKrathong {
  id: string;
  senderName: string;
  wishMessage: string;
  wishCategory: string;
  baseId: string;
  candleColorId: string;
  incenseId: string;
  flowers: string[];
  includeCoins: boolean;
  createdAt: number;
  blessCount: number;
  xPercent: number; // 5 to 90%
  yPercent: number; // 25 to 85%
  scale: number;    // 0.65 to 1.15 for depth perception
  driftSpeed: number;
}
