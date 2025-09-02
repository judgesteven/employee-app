// User types
export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  team: string;
  dailyStepCount: number;
  allTimeStepCount: number;
  dailyActiveMinutes: number;
  allTimeActiveMinutes: number;
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
  category?: string; // Category like "POP MUSIC"
  status: 'completed' | 'started' | 'locked'; // Achievement status
  currentProgress?: number; // Current progress (e.g., 3)
  totalSteps?: number; // Total steps needed (e.g., 10)
  badgeImage?: string; // URL to achievement badge image
  backgroundColor?: string; // Background color for the card
}

// Challenge objective for missions with multiple objectives
export interface ChallengeObjective {
  id: string;
  name: string;
  targetValue: number;
  currentProgress: number;
  unit: string; // 'steps', 'minutes', etc.
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  targetValue: number;
  currentProgress: number;
  objectives?: ChallengeObjective[]; // For missions with multiple objectives
  reward: number; // gems
  experience?: number; // experience points
  expiresAt: Date;
  completed: boolean;
  icon: string;
  imgUrl?: string; // Mission image URL from GameLayer API
  tags?: string[]; // Tags from GameLayer API
  priority?: number; // Priority for ordering missions
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
  brand?: string; // Brand name like "NINTENDO", "LEGO"
  brandColor?: string; // Brand badge color
  heroImage?: string; // Large hero image URL
  availableCount?: number; // Number available (e.g., 5, 100, 1000)
  expiresAt?: Date; // Expiration date for countdown
  rarity?: 'large' | 'medium' | 'refreshing' | 'small'; // Prize tier
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
