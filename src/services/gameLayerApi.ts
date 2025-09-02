import axios from 'axios';
import { User, Challenge, Leaderboard, Reward, Achievement, ApiResponse } from '../types';

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
  imgUrl?: string; // Player avatar image URL from GameLayer API
  level?: {
    name: string;
    number: number;
  };
  // Add other fields as needed based on actual API response
}

// User API calls
export const gameLayerApi = {
  // GameLayer specific player fetch
  async getPlayer(playerId: string = PLAYER_ID): Promise<GameLayerPlayer> {
    console.log(`🚀 API CALL: GET /players/${playerId}`);
    console.log(`   Account: ${ACCOUNT_ID}`);
    
    const response = await api.get(`/players/${playerId}`, {
      params: {
        account: ACCOUNT_ID
      }
    });
    
    console.log(`✅ API RESPONSE: ${response.status}`);
    console.log('📋 Player Data:', response.data);
    
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

  // Achievements - GET with player ID as query parameter
  async getAchievements(playerId: string = PLAYER_ID): Promise<Achievement[]> {
    if (!ENABLE_API_CALLS) {
      console.log(`[MOCK] GameLayer getAchievements for player: ${playerId}`);
      await mockDelay(100);
      return [];
    }

    try {
      console.log(`🚀 API CALL: GET /players/${playerId}/achievements`);
      console.log(`   Account: ${ACCOUNT_ID}`);
      
      const response = await api.get(`/players/${playerId}/achievements`, {
        params: {
          account: ACCOUNT_ID
        }
      });
      
      console.log(`✅ API RESPONSE: ${response.status}`);
      console.log(`📊 Achievements Count: ${response.data?.length || 0}`);
      console.log('📋 Raw Achievements:', response.data);
      
      // Transform GameLayer achievement data to Achievement interface
      const achievements = response.data;
      if (Array.isArray(achievements)) {
        const transformedAchievements = achievements.map((achievement: any) => {
          console.log('=== GameLayer API: Processing Achievement ===');
          console.log('GameLayer API: Full raw achievement data:', JSON.stringify(achievement, null, 2));
          
          // Determine status based on completion
          let status: 'completed' | 'started' | 'locked' = 'locked';
          if (achievement.completed || achievement.unlocked) {
            status = 'completed';
          } else if (achievement.progress > 0 || achievement.currentProgress > 0) {
            status = 'started';
          }

          const transformed = {
            id: achievement.id,
            name: achievement.name || achievement.title || 'Untitled Achievement',
            description: achievement.description || '',
            icon: achievement.icon || achievement.emoji || '🏆',
            unlockedAt: achievement.unlockedAt || achievement.completedAt ? new Date(achievement.unlockedAt || achievement.completedAt) : undefined,
            category: achievement.category || achievement.tag || achievement.type,
            status: status,
            currentProgress: achievement.progress || achievement.currentProgress || 0,
            totalSteps: achievement.target || achievement.targetValue || achievement.maxProgress || 1,
            badgeImage: achievement.badgeImage || achievement.image || achievement.imgUrl,
            backgroundColor: achievement.backgroundColor || achievement.color
          };
          

          return transformed;
        });
        
        const completedCount = transformedAchievements.filter(a => a.status === 'completed').length;
        const startedCount = transformedAchievements.filter(a => a.status === 'started').length;
        const lockedCount = transformedAchievements.filter(a => a.status === 'locked').length;
        
        console.log(`📈 Achievement Summary: ${transformedAchievements.length} total`);
        console.log(`   ✅ Completed: ${completedCount} | 🔄 Started: ${startedCount} | 🔒 Locked: ${lockedCount}`);
        
        return transformedAchievements;
      }
      
      return [];
    } catch (error) {
      console.error('GameLayer getAchievements API error:', error);
      return [];
    }
  },

  // Unlock achievement
  async unlockAchievement(playerId: string = PLAYER_ID, achievementId: string): Promise<void> {
    if (!ENABLE_API_CALLS) {
      console.log(`[MOCK] GameLayer unlockAchievement: ${achievementId} for player ${playerId}`);
      await mockDelay(100);
      return;
    }

    await api.post(`/achievements/${achievementId}/unlock`, {
      account: ACCOUNT_ID,
      player: playerId
    });
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

  // Missions - GET with player ID as query parameter
  async getMissions(playerId: string = PLAYER_ID): Promise<Challenge[]> {
    if (!ENABLE_API_CALLS) {
      console.log(`[MOCK] GameLayer getMissions for player: ${playerId}`);
      await mockDelay(100);
      return [];
    }

    try {
      console.log(`[API] GameLayer getMissions for player: ${playerId}`);
      const response = await api.get('/missions', {
        params: {
          player: playerId,
          account: ACCOUNT_ID
        }
      });
      
      console.log('GameLayer getMissions API response:', response.data);
      
      // Transform GameLayer mission data to Challenge interface
      const missions = response.data;
      if (Array.isArray(missions)) {
        const transformedMissions = missions.map((mission: any) => {
          console.log('=== GameLayer API: Processing Mission ===');
          console.log('GameLayer API: Full raw mission data:', JSON.stringify(mission, null, 2));
          
          // Extract target and progress from objectives.events structure
          let targetValue = 1;
          let currentProgress = 0;
          let objectives: any[] = [];
          
          console.log('GameLayer API: Checking objectives structure...');
          console.log('GameLayer API: mission.objectives exists:', !!mission.objectives);
          console.log('GameLayer API: objectives is object:', typeof mission.objectives === 'object');
          
          // objectives is an object, not an array
          if (mission.objectives && typeof mission.objectives === 'object') {
            const objective = mission.objectives;
            console.log('GameLayer API: Objective:', JSON.stringify(objective, null, 2));
            console.log('GameLayer API: objective.events exists:', !!objective.events);
            console.log('GameLayer API: events is array:', Array.isArray(objective.events));
            console.log('GameLayer API: events length:', objective.events?.length || 0);
            
            if (objective.events && Array.isArray(objective.events) && objective.events.length > 0) {
              // Extract all objectives for multi-objective missions
              objectives = objective.events.map((event: any, index: number) => ({
                id: `${mission.id}_obj_${index}`,
                name: event.name || event.title || event.type || `Objective ${index + 1}`,
                targetValue: event.count || 1,
                currentProgress: event.currentCount || 0,
                unit: event.type || 'steps'
              }));
              
              console.log('GameLayer API: Extracted objectives:', objectives);
              
              // Use the first event for main progress (backward compatibility)
              const event = objective.events[0];
              console.log('GameLayer API: First event:', JSON.stringify(event, null, 2));
              targetValue = event.count || 1;
              currentProgress = event.currentCount || 0;
              console.log('GameLayer API: SUCCESS! Extracted from objectives.events - target:', targetValue, 'progress:', currentProgress);
            } else {
              console.log('GameLayer API: No events found in objective');
            }
          } else {
            console.log('GameLayer API: No objectives found, checking fallback structures...');
          }
          
          // Fallback to old structure if objectives structure not found
          if (targetValue === 1 && currentProgress === 0) {
            console.log('GameLayer API: Trying fallback extraction...');
            console.log('GameLayer API: mission.events:', mission.events);
            console.log('GameLayer API: mission.goal:', mission.goal);
            console.log('GameLayer API: mission.progress:', mission.progress);
            
            targetValue = mission.events?.[0]?.count || mission.goal || 1;
            currentProgress = mission.events?.[0]?.currentCount || mission.progress || 0;
            console.log('GameLayer API: Using fallback values - target:', targetValue, 'progress:', currentProgress);
          }
          
          // Calculate end date based on category rules
          const calculateEndDate = (category: string, activeSection: any): Date => {
            const categoryLower = category?.toLowerCase() || 'daily';
            const now = new Date();
            
            console.log('GameLayer API: Calculating end date for category:', categoryLower);
            console.log('GameLayer API: Active section:', activeSection);
            
            switch (categoryLower) {
              case 'daily':
                // 00:00 same day (end of current day)
                const endOfDay = new Date(now);
                endOfDay.setHours(23, 59, 59, 999); // End of current day
                console.log('GameLayer API: Daily end date:', endOfDay);
                return endOfDay;
                
              case 'weekly':
                // 00:00 on Sunday of same week
                const daysUntilSunday = (7 - now.getDay()) % 7; // 0 = Sunday, so this gets days until next Sunday
                const endOfWeek = new Date(now);
                endOfWeek.setDate(now.getDate() + daysUntilSunday);
                endOfWeek.setHours(0, 0, 0, 0); // 00:00 on Sunday
                console.log('GameLayer API: Weekly end date (Sunday 00:00):', endOfWeek);
                return endOfWeek;
                
              case 'monthly':
                // 00:00 on last day of current month
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
                endOfMonth.setHours(0, 0, 0, 0); // 00:00 on last day
                console.log('GameLayer API: Monthly end date (last day 00:00):', endOfMonth);
                return endOfMonth;
                
              case 'special':
                // Use date provided by API 'to' field in 'active' section
                const specialDate = activeSection?.to ? new Date(activeSection.to) : new Date(Date.now() + 24 * 60 * 60 * 1000);
                console.log('GameLayer API: Special end date from API:', specialDate);
                return specialDate;
                
              default:
                // Fallback to API date or 24 hours from now
                const fallbackDate = activeSection?.to ? new Date(activeSection.to) : new Date(Date.now() + 24 * 60 * 60 * 1000);
                console.log('GameLayer API: Fallback end date:', fallbackDate);
                return fallbackDate;
            }
          };

          const transformed = {
            id: mission.id,
            title: mission.name || mission.title || 'Untitled Mission',
            description: mission.description || '',
            type: mission.category?.toLowerCase() || 'daily',
            targetValue: targetValue,
            currentProgress: currentProgress,
            objectives: objectives.length > 1 ? objectives : undefined, // Only include if multiple objectives
            reward: mission.reward?.credits || mission.reward || 0,
            expiresAt: calculateEndDate(mission.category, mission.active),
            completed: mission.completed || false,
            icon: mission.imgUrl || mission.image || '🎯',
            imgUrl: mission.imgUrl || mission.image || '/api/placeholder/60/60',
            tags: mission.tags || mission.labels || [],
            priority: mission.priority || 0 // Extract priority for ordering
          };
          console.log('GameLayer API: Transformed mission:', transformed);
          return transformed;
        });
        console.log('GameLayer API: All transformed missions:', transformedMissions);
        return transformedMissions;
      }
      
      return [];
    } catch (error) {
      console.error('GameLayer getMissions API error:', error);
      return [];
    }
  },

};

export default gameLayerApi;
