import axios from 'axios';
import { User, Challenge, Leaderboard, Reward, ApiResponse } from '../types';

const API_BASE_URL = 'https://api.gamelayer.co/api/v0';
const API_KEY = 'eb0f1b46acd3fde97c008db5c4fe9ed0';
const ACCOUNT_ID = 'employee-app';
const PLAYER_ID = 'test-player';

// Enable/disable API calls for testing
const ENABLE_API_CALLS = true; // Set to true to test with real GameLayer API

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'api-key': API_KEY,
  },
});

// Mock delay to simulate API calls
const mockDelay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

// GameLayer Player API response type
interface GameLayerPlayer {
  id: string;
  name: string;
  points?: number; // Points represent step count in GameLayer
  // Add other fields as needed based on actual API response
}

// User API calls
export const gameLayerApi = {
  // GameLayer specific player fetch
  async getPlayer(playerId: string = PLAYER_ID): Promise<GameLayerPlayer> {
    const response = await api.get(`/players/${playerId}`, {
      params: {
        account: ACCOUNT_ID
      }
    });
    return response.data;
  },

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

  // Complete step-tracker event with step count delta
  async trackSteps(playerId: string | undefined, stepCount: number): Promise<void> {
    const actualPlayerId = playerId || PLAYER_ID;
    
    if (!ENABLE_API_CALLS) {
      console.log(`[MOCK] GameLayer trackSteps: ${stepCount} steps completed for ${actualPlayerId}`);
      await mockDelay(100);
      return;
    }

    // Send the step count delta to GameLayer
    // Event ID is in the path: /events/{event-id}/complete
    // Headers already include API key from axios instance
    // Payload has account and player information
    await api.post(`/events/step-tracker/complete`, {
      account: ACCOUNT_ID,
      player: actualPlayerId,
      count: stepCount
    });
  },

  // Single step tracking (for backwards compatibility)
  async trackStep(playerId: string = PLAYER_ID): Promise<void> {
    return this.trackSteps(playerId, 1);
  },


};

export default gameLayerApi;
