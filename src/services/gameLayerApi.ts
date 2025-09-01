import axios from 'axios';
import { User, Challenge, Leaderboard, Reward, ApiResponse } from '../types';

const API_BASE_URL = 'https://api.gamelayer.co/api/v0';
const API_KEY = 'eb0f1b46acd3fde97c008db5c4fe9ed0';
const ACCOUNT_ID = 'employee-app';
const PLAYER_ID = 'test-player';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'api-key': API_KEY,
  },
});

// GameLayer Player API response type
interface GameLayerPlayer {
  id: string;
  name: string;
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

  // Events - for tracking activities like steps
  async trackEvent(playerId: string, eventName: string, eventData: any): Promise<void> {
    await api.post(`/players/${playerId}/events`, {
      event: eventName,
      data: eventData
    }, {
      params: {
        account: ACCOUNT_ID
      }
    });
  },

  // Specific method for tracking steps
  async trackStep(playerId: string = PLAYER_ID, timestamp?: Date): Promise<void> {
    await this.trackEvent(playerId, 'step-tracker', {
      timestamp: timestamp || new Date().toISOString(),
      source: 'apple_health'
    });
  },

  // Batch step tracking for efficiency
  async trackSteps(playerId: string = PLAYER_ID, stepCount: number, timestamp?: Date): Promise<void> {
    const stepEvents = Array.from({ length: stepCount }, (_, index) => ({
      event: 'step-tracker',
      data: {
        timestamp: timestamp || new Date().toISOString(),
        source: 'apple_health',
        sequence: index + 1
      }
    }));

    // Send in batches to avoid overwhelming the API
    const batchSize = 100;
    for (let i = 0; i < stepEvents.length; i += batchSize) {
      const batch = stepEvents.slice(i, i + batchSize);
      await api.post(`/players/${playerId}/events/batch`, {
        events: batch
      }, {
        params: {
          account: ACCOUNT_ID
        }
      });
    }
  },
};

export default gameLayerApi;
