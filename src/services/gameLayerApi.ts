import axios from 'axios';
import { User, Challenge, Leaderboard, Reward, ApiResponse } from '../types';

const API_BASE_URL = 'https://api.gamelayer.co'; // Update with actual GameLayer API URL
const API_KEY = process.env.REACT_APP_GAMELAYER_API_KEY;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// User API calls
export const gameLayerApi = {
  // User management
  async getUser(userId: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data.data;
  },

  async updateUserSteps(userId: string, stepCount: number): Promise<void> {
    await api.patch(`/users/${userId}/steps`, { stepCount });
  },

  async updateUserGems(userId: string, gems: number): Promise<void> {
    await api.patch(`/users/${userId}/gems`, { gems });
  },

  // Challenges/Missions
  async getChallenges(userId: string): Promise<Challenge[]> {
    const response = await api.get<ApiResponse<Challenge[]>>(`/users/${userId}/challenges`);
    return response.data.data;
  },

  async completeChallenge(userId: string, challengeId: string): Promise<void> {
    await api.post(`/users/${userId}/challenges/${challengeId}/complete`);
  },

  async getChallengeProgress(userId: string, challengeId: string): Promise<number> {
    const response = await api.get<ApiResponse<{ progress: number }>>(`/users/${userId}/challenges/${challengeId}/progress`);
    return response.data.data.progress;
  },

  // Leaderboards
  async getLeaderboards(): Promise<Leaderboard[]> {
    const response = await api.get<ApiResponse<Leaderboard[]>>('/leaderboards');
    return response.data.data;
  },

  async getLeaderboard(leaderboardId: string): Promise<Leaderboard> {
    const response = await api.get<ApiResponse<Leaderboard>>(`/leaderboards/${leaderboardId}`);
    return response.data.data;
  },

  // Rewards
  async getRewards(): Promise<Reward[]> {
    const response = await api.get<ApiResponse<Reward[]>>('/rewards');
    return response.data.data;
  },

  async claimReward(userId: string, rewardId: string): Promise<void> {
    await api.post(`/users/${userId}/rewards/${rewardId}/claim`);
  },

  async getUserRewards(userId: string): Promise<Reward[]> {
    const response = await api.get<ApiResponse<Reward[]>>(`/users/${userId}/rewards`);
    return response.data.data;
  },

  // Achievements
  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    await api.post(`/users/${userId}/achievements/${achievementId}/unlock`);
  },
};

export default gameLayerApi;
