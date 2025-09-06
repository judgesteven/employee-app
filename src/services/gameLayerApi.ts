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
  imgUrl?: string; // Player avatar image URL from GameLayer API
  points?: number; // Points represent step count in GameLayer (top level)
  credits?: number; // Credits represent gems/currency in GameLayer (top level)
  team?: string; // Team ID from GameLayer API
  level?: {
    name: string;
    number: number;
  };
  // Add other fields as needed based on actual API response
}

// GameLayer Team API response type
interface GameLayerTeam {
  team: {
    id: string;
    name: string;
    description?: string;
    imgUrl?: string;
    account?: string;
    category?: string;
    createdOn?: string;
    credits?: number;
    isAvailable?: boolean;
    level?: {
      id: string;
      name: string;
      description: string;
      imgUrl: string;
      ordinal: number;
    };
    points?: number;
    tags?: string[];
  };
  players?: Array<any>;
  // Add other fields as needed based on actual API response
}

// GameLayer Raffle API response type
interface GameLayerRaffle {
  id: string;
  name: string;
  description?: string;
  imgUrl?: string;
  cost?: number;
  category?: string;
  isAvailable?: boolean;
  tags?: string[];
  // Add other fields as needed based on actual API response
}

// GameLayer Prize API response type
interface GameLayerPrize {
  id: string;
  name: string;
  description?: string;
  imgUrl?: string;
  cost?: number;
  category?: string;
  isAvailable?: boolean;
  tags?: string[];
  // Add other fields as needed based on actual API response
}

// GameLayer Leaderboard API response types
interface GameLayerLeaderboardEntry {
  player?: {
    id: string;
    name: string;
    imgUrl?: string;
  };
  team?: {
    id: string;
    name: string;
    imgUrl?: string;
  };
  score: number;
  rank: number;
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

  // GameLayer specific team fetch
  async getTeam(teamId: string): Promise<GameLayerTeam> {
    const response = await api.get(`/teams/${teamId}`, {
      params: {
        account: ACCOUNT_ID
      }
    });
    
    return response.data;
  },

  // GameLayer specific raffles fetch
  async getRaffles(): Promise<GameLayerRaffle[]> {
    const response = await api.get('/raffles', {
      params: {
        account: ACCOUNT_ID
      }
    });
    
    return response.data;
  },

  // GameLayer specific prizes fetch
  async getPrizes(): Promise<GameLayerPrize[]> {
    const response = await api.get('/prizes', {
      params: {
        account: ACCOUNT_ID
      }
    });
    
    return response.data;
  },

  // Get all missions for a player
  async getPlayerMissions(playerId: string = PLAYER_ID): Promise<any[]> {
    const response = await api.get(`/players/${playerId}/missions`, {
      params: {
        account: ACCOUNT_ID
      }
    });
    
    return response.data;
  },

  // Get specific mission progress for a player
  async getPlayerMission(playerId: string = PLAYER_ID, missionId: string): Promise<any> {
    const response = await api.get(`/players/${playerId}/missions/${missionId}`, {
      params: {
        account: ACCOUNT_ID
      }
    });
    
    return response.data;
  },

  async getPlayerPrizes(playerId: string = PLAYER_ID): Promise<GameLayerPrize[]> {
    const response = await api.get(`/players/${playerId}/prizes`, {
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
    console.log(`🏆 API CALL: GET /leaderboards`);
    const response = await api.get<ApiResponse<Leaderboard[]>>('/leaderboards', {
      params: {
        account: ACCOUNT_ID
      }
    });
    console.log(`✅ API RESPONSE: leaderboards - Status: ${response.status}, Count: ${response.data.data?.length || 0}`);
    return response.data.data;
  },

  async getLeaderboard(leaderboardId: 'pvp' | 'tvt'): Promise<GameLayerLeaderboardEntry[]> {
    if (!ENABLE_API_CALLS) {
      console.log(`[MOCK] GameLayer getLeaderboard: ${leaderboardId}`);
      await mockDelay(100);
      return [];
    }

    try {
      console.log(`🏆 API CALL: GET /leaderboards/${leaderboardId}`);
      
      const response = await api.get(`/leaderboards/${leaderboardId}`, {
        params: {
          account: ACCOUNT_ID
        }
      });
      
      console.log(`✅ API RESPONSE: ${leaderboardId} - Status: ${response.status}, Entries: ${response.data?.scores?.data?.length || 0}`);
      
      // Handle the actual GameLayer leaderboard response structure
      let entries: GameLayerLeaderboardEntry[] = [];
      
      if (response.data && response.data.scores && Array.isArray(response.data.scores.data)) {
        if (leaderboardId === 'tvt') {
          // For TvT, aggregate duplicate teams and fetch team images
          const teamMap = new Map();
          
          // First pass: aggregate scores for duplicate teams
          response.data.scores.data.forEach((item: any) => {
            const teamId = item.team;
            if (teamMap.has(teamId)) {
              // Add to existing team score
              const existing = teamMap.get(teamId);
              existing.score += item.scores;
            } else {
              // New team entry
              teamMap.set(teamId, {
                team: {
                  id: teamId,
                  name: item.name,
                  imgUrl: undefined // Will fetch separately
                },
                score: item.scores,
                rank: item.rank // Will recalculate after aggregation
              });
            }
          });
          
          // Convert map to array and sort by score
          const aggregatedTeams = Array.from(teamMap.values()).sort((a, b) => b.score - a.score);
          
          // Recalculate ranks
          aggregatedTeams.forEach((team, index) => {
            team.rank = index + 1;
          });
          
          // Fetch team images for each team
          console.log(`📷 Fetching team images for ${aggregatedTeams.length} teams...`);
          const teamsWithImages = await Promise.all(
            aggregatedTeams.map(async (teamEntry) => {
              try {
                const teamDetails = await this.getTeam(teamEntry.team.id);
                return {
                  ...teamEntry,
                  team: {
                    ...teamEntry.team,
                    imgUrl: teamDetails.team?.imgUrl || undefined
                  }
                };
              } catch (error) {
                console.warn(`Failed to fetch details for team ${teamEntry.team.id}:`, error);
                return teamEntry; // Return without image if fetch fails
              }
            })
          );
          
          entries = teamsWithImages;
        } else {
          // Player vs Player format - check if it's player-based or team-member-based
          entries = response.data.scores.data.map((item: any) => {
            if (item.player) {
              return {
                player: {
                  id: item.player,
                  name: item.name,
                  imgUrl: item.imgUrl
                },
                score: item.scores || item.score,
                rank: item.rank
              };
            } else if (item.team && item.name) {
              // PvP might be returning team members, so treat as players
              return {
                player: {
                  id: item.team + '-member', // Create a unique ID
                  name: item.name,
                  imgUrl: item.imgUrl
                },
                score: item.scores || item.score,
                rank: item.rank
              };
            } else {
              // Fallback format
              return {
                player: {
                  id: item.id || `player-${item.rank}`,
                  name: item.name || 'Unknown Player',
                  imgUrl: item.imgUrl
                },
                score: item.scores || item.score || 0,
                rank: item.rank
              };
            }
          });
        }
      } else if (response.data && response.data.error) {
        console.warn(`GameLayer API error for ${leaderboardId}:`, response.data.error);
        console.warn(`Error details:`, response.data);
        entries = [];
      } else {
        console.warn(`Unexpected response structure for ${leaderboardId}:`, response.data);
        entries = [];
      }
      
      return entries;
    } catch (error) {
      const axiosError = error as any;
      console.error(`❌ API ERROR: GET /leaderboards/${leaderboardId} - Status: ${axiosError.response?.status || 'Network Error'}`);
      return [];
    }
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
      const response = await api.get(`/players/${playerId}/achievements`, {
        params: {
          account: ACCOUNT_ID
        }
      });
      
      // Transform GameLayer achievement data to Achievement interface
      const responseData = response.data;
      
      // Extract achievements from nested structure
      const achievementData = responseData.achievements || responseData;
      
      let allAchievements: any[] = [];
      
      // Handle the GameLayer API format with completed/started arrays
      if (achievementData && typeof achievementData === 'object') {
        // Add completed achievements
        if (Array.isArray(achievementData.completed)) {
          const completedWithStatus = achievementData.completed.map((achievement: any) => ({
            ...achievement,
            status: 'completed'
          }));
          allAchievements = allAchievements.concat(completedWithStatus);
        }
        
        // Add started achievements
        if (Array.isArray(achievementData.started)) {
          const startedWithStatus = achievementData.started.map((achievement: any) => ({
            ...achievement,
            status: 'started'
          }));
          allAchievements = allAchievements.concat(startedWithStatus);
        }
      }
      
      
      if (allAchievements.length > 0) {
        const transformedAchievements = allAchievements.map((achievement: any) => {
          const transformed = {
            id: achievement.id,
            title: achievement.name || 'Unknown Achievement',
            description: achievement.description || 'No description available',
            category: achievement.category || 'general',
            unlockedAt: achievement.status === 'completed' ? (achievement.actions?.completedOn || new Date().toISOString()) : null,
            status: achievement.status,
            currentProgress: achievement.count || 0,
            totalSteps: achievement.steps || 1,
            badgeImage: achievement.imgUrl,
            backgroundColor: achievement.backgroundColor || achievement.color
          };
          
          return transformed;
        });
        
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

  // Missions - GET /missions with player ID as query parameter (includes progress data)
  async getMissions(playerId: string = PLAYER_ID): Promise<Challenge[]> {
    if (!ENABLE_API_CALLS) {
      console.log(`[MOCK] GameLayer getMissions for player: ${playerId}`);
      await mockDelay(100);
      // Return mock missions for testing
      return [
        {
          id: 'step-starter',
          title: 'Step Starter',
          description: 'Take your first 1,000 steps today',
          type: 'daily',
          targetValue: 1000,
          currentProgress: 342,
          reward: 50,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          completed: false,
          icon: '👟',
          priority: 1,
          imgUrl: 'https://images.gamelayer.co/glimages/employee-app/step_mission.png'
        },
        {
          id: 'daily-goal',
          title: 'Daily Goal',
          description: 'Reach 10,000 steps today',
          type: 'daily',
          targetValue: 10000,
          currentProgress: 7843,
          reward: 100,
          expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
          completed: false,
          icon: '🎯',
          priority: 1,
          imgUrl: 'https://images.gamelayer.co/glimages/employee-app/daily_goal.png'
        }
      ];
    }

    try {
      const response = await api.get('/missions', {
        params: {
          player: playerId,
          account: ACCOUNT_ID
        }
      });
      
      // Transform GameLayer mission data to Challenge interface
      const missions = response.data;
      if (Array.isArray(missions)) {
        const transformedMissions = missions.map((mission: any) => {
          // Extract target and progress from mission data
          let targetValue = 1;
          let currentProgress = 0;
          let objectives: any[] = [];
          
          // Extract from objectives structure if available
          if (mission.objectives && typeof mission.objectives === 'object') {
            const objective = mission.objectives;
            
            if (objective.events && Array.isArray(objective.events) && objective.events.length > 0) {
              // Extract all objectives for multi-objective missions
              objectives = objective.events.map((event: any, index: number) => ({
                id: `${mission.id}_obj_${index}`,
                name: event.name || event.title || event.type || `Objective ${index + 1}`,
                targetValue: event.count || 1,
                currentProgress: event.currentCount || 0,
                unit: event.type || 'steps'
              }));
              
              // Use the first event for main progress
              const event = objective.events[0];
              targetValue = event.count || 1;
              currentProgress = event.currentCount || 0;
            }
          }
          
          // Fallback extraction
          if (targetValue === 1 && currentProgress === 0) {
            currentProgress = mission.currentProgress || mission.progress || 0;
            targetValue = mission.target || mission.targetValue || mission.goal || 1;
            
            if (targetValue === 1 && currentProgress === 0) {
              targetValue = mission.events?.[0]?.count || mission.goal || 1;
              currentProgress = mission.events?.[0]?.currentCount || mission.progress || 0;
            }
          }
          
          // Calculate end date based on category rules
          const calculateEndDate = (category: string, activeSection: any): Date => {
            const categoryLower = category?.toLowerCase() || 'daily';
            const now = new Date();
            
            switch (categoryLower) {
              case 'daily':
                const endOfDay = new Date(now);
                endOfDay.setHours(23, 59, 59, 999);
                return endOfDay;
                
              case 'weekly':
                const daysUntilSunday = (7 - now.getDay()) % 7;
                const endOfWeek = new Date(now);
                endOfWeek.setDate(now.getDate() + daysUntilSunday);
                endOfWeek.setHours(0, 0, 0, 0);
                return endOfWeek;
                
              case 'monthly':
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endOfMonth.setHours(0, 0, 0, 0);
                return endOfMonth;
                
              case 'special':
                return activeSection?.to ? new Date(activeSection.to) : new Date(Date.now() + 24 * 60 * 60 * 1000);
                
              default:
                return activeSection?.to ? new Date(activeSection.to) : new Date(Date.now() + 24 * 60 * 60 * 1000);
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
          return transformed;
        });
        
        return transformedMissions;
      }
      
      // Return mock missions if no missions from API
      console.log('No missions from API, returning mock data');
      return [
        {
          id: 'step-starter',
          title: 'Step Starter',
          description: 'Take your first 1,000 steps today',
          type: 'daily',
          targetValue: 1000,
          currentProgress: 342,
          reward: 50,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          completed: false,
          icon: '👟',
          priority: 1,
          imgUrl: 'https://images.gamelayer.co/glimages/employee-app/step_mission.png'
        },
        {
          id: 'daily-goal',
          title: 'Daily Goal',
          description: 'Reach 10,000 steps today',
          type: 'daily',
          targetValue: 10000,
          currentProgress: 7843,
          reward: 100,
          expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
          completed: false,
          icon: '🎯',
          priority: 1,
          imgUrl: 'https://images.gamelayer.co/glimages/employee-app/daily_goal.png'
        }
      ];
    } catch (error) {
      console.error('GameLayer getMissions API error:', error);
      // Return mock missions on error
      return [
        {
          id: 'step-starter',
          title: 'Step Starter',
          description: 'Take your first 1,000 steps today',
          type: 'daily',
          targetValue: 1000,
          currentProgress: 342,
          reward: 50,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          completed: false,
          icon: '👟',
          priority: 1,
          imgUrl: 'https://images.gamelayer.co/glimages/employee-app/step_mission.png'
        }
      ];
    }
  },

  // Get player mission progress - GET /players/{player}/missions
  async getPlayerMissionProgress(playerId: string = PLAYER_ID): Promise<Record<string, { currentProgress: number; targetValue: number }>> {
    if (!ENABLE_API_CALLS) {
      return {};
    }

    try {
      console.log(`🎯 API CALL: GET /players/${playerId}/missions`);
      const response = await api.get(`/players/${playerId}/missions`, {
        params: { account: ACCOUNT_ID }
      });
      
      console.log(`✅ Mission progress response:`, response.data);
      
      const progressMap: Record<string, { currentProgress: number; targetValue: number }> = {};
      
      if (Array.isArray(response.data?.missions?.started)) {
        console.log(`📊 Processing ${response.data.missions.started.length} started missions`);
        
        response.data.missions.started.forEach((mission: any) => {
          if (mission.id && mission.objectives?.events) {
            const events = mission.objectives.events;
            
            // For missions with multiple objectives, use the first event for main progress
            // but also store individual objective progress
            if (events.length > 0) {
              const firstEvent = events[0];
              const progress = {
                currentProgress: firstEvent.currentCount || 0,
                targetValue: firstEvent.count || 1
              };
              
              progressMap[mission.id] = progress;
              
              console.log(`📈 Mission ${mission.id}: ${progress.currentProgress}/${progress.targetValue}`);
              
              // If there are multiple events, also create entries for individual objectives
              if (events.length > 1) {
                events.forEach((event: any, index: number) => {
                  const objectiveId = `${mission.id}_obj_${index}`;
                  progressMap[objectiveId] = {
                    currentProgress: event.currentCount || 0,
                    targetValue: event.count || 1
                  };
                });
              }
            }
          }
        });
      }
      
      console.log(`🎯 Final progress map:`, progressMap);
      return progressMap;
    } catch (error) {
      console.error('Error fetching player mission progress:', error);
      return {};
    }
  },


};

export default gameLayerApi;
