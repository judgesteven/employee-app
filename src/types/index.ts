// User types
export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  team: string;
  dailyStepCount: number;
  allTimeStepCount: number;
  gems: number;
  achievements: Achievement[];
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  targetValue: number;
  currentProgress: number;
  reward: number; // gems
  expiresAt: Date;
  completed: boolean;
  icon: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'allTime';
  entries: LeaderboardEntry[];
}

// Reward types
export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number; // gems required
  image: string;
  category: string;
  available: boolean;
  claimed?: boolean;
}

// Health data types
export interface HealthData {
  stepCount: number;
  date: Date;
  source: 'apple_health' | 'google_fit';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
