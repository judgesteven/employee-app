import { gameLayerApi } from './gameLayerApi';

// GameLayer Player type (copied from gameLayerApi.ts since it's not exported)
interface GameLayerPlayer {
  id: string;
  name: string;
  imgUrl?: string;
  points?: number;
  credits?: number;
  team?: string;
  level?: {
    name: string;
    number: number;
  };
}

class PlayerDataPollingService {
  private static instance: PlayerDataPollingService;
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling = false;
  private currentPlayerId: string | null = null;
  private listeners: Set<(playerData: GameLayerPlayer & { dailyStepCount?: number }) => void> = new Set();
  private missionListeners: Set<(missions: any[]) => void> = new Set();
  private rewardListeners: Set<(rewards: any[]) => void> = new Set();
  private prizeListeners: Set<(prizes: any[]) => void> = new Set();

  static getInstance(): PlayerDataPollingService {
    if (!PlayerDataPollingService.instance) {
      PlayerDataPollingService.instance = new PlayerDataPollingService();
    }
    return PlayerDataPollingService.instance;
  }

  // Start polling for player data updates
  startPolling(playerId?: string): void {
    if (this.isPolling) {
      console.log('🔄 Player data polling already active');
      return;
    }

    this.currentPlayerId = playerId || null;
    this.isPolling = true;

    console.log('▶️ Starting player data polling every 10 seconds...');

    // Initial fetch
    this.fetchPlayerData();

    // Set up interval for every 10 seconds
    this.pollingInterval = setInterval(() => {
      this.fetchPlayerData();
    }, 10000);
  }

  // Stop polling
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    
    // Clear all listeners when stopping
    this.listeners.clear();
    this.missionListeners.clear();
    this.rewardListeners.clear();
    this.prizeListeners.clear();
    
    console.log('⏹️ Player data polling stopped');
  }

  // Add listener for player data updates
  addListener(callback: (playerData: GameLayerPlayer & { dailyStepCount?: number }) => void): void {
    this.listeners.add(callback);
  }

  // Remove listener
  removeListener(callback: (playerData: GameLayerPlayer & { dailyStepCount?: number }) => void): void {
    this.listeners.delete(callback);
  }

  // Add listener for mission updates
  addMissionListener(callback: (missions: any[]) => void): void {
    this.missionListeners.add(callback);
  }

  // Remove mission listener
  removeMissionListener(callback: (missions: any[]) => void): void {
    this.missionListeners.delete(callback);
  }

  // Add listener for reward updates
  addRewardListener(callback: (rewards: any[]) => void): void {
    this.rewardListeners.add(callback);
  }

  // Remove reward listener
  removeRewardListener(callback: (rewards: any[]) => void): void {
    this.rewardListeners.delete(callback);
  }

  // Add listener for prize updates
  addPrizeListener(callback: (prizes: any[]) => void): void {
    this.prizeListeners.add(callback);
  }

  // Remove prize listener
  removePrizeListener(callback: (prizes: any[]) => void): void {
    this.prizeListeners.delete(callback);
  }

  // Fetch player data from GameLayer
  private async fetchPlayerData(): Promise<void> {
    try {
      const playerData = await gameLayerApi.getPlayer(this.currentPlayerId || undefined);
      
      if (playerData) {
        // Also fetch mission progress to get updated step count
        const missionProgress = await gameLayerApi.getPlayerMissionProgress();
        const stepMission = missionProgress['daily-step-tracker'];
        
        const enhancedPlayerData = {
          ...playerData,
          dailyStepCount: stepMission?.currentProgress || 0
        };
        
        console.log('📊 Updated player data from GameLayer:', {
          name: enhancedPlayerData.name,
          points: enhancedPlayerData.points,
          credits: enhancedPlayerData.credits,
          dailyStepCount: enhancedPlayerData.dailyStepCount
        });

        // Notify all listeners
        this.listeners.forEach(callback => {
          try {
            callback(enhancedPlayerData);
          } catch (error) {
            console.error('Error in player data listener:', error);
          }
        });
      }

      // Fetch and notify all data updates
      await Promise.all([
        this.fetchMissionProgress(),
        this.fetchRewards(),
        this.fetchPlayerPrizes()
      ]);
    } catch (error) {
      console.error('❌ Error fetching player data:', error);
    }
  }

  // Fetch mission progress from GameLayer
  private async fetchMissionProgress(): Promise<void> {
    try {
      const missions = await gameLayerApi.getPlayerMissions(this.currentPlayerId || undefined);
      
      if (missions && Array.isArray(missions)) {
        console.log('🎯 Updated mission progress from GameLayer:', {
          missionCount: missions.length,
          activeMissions: missions.filter(m => !m.completed).length
        });

        // Notify all mission listeners
        this.missionListeners.forEach(callback => {
          try {
            callback(missions);
          } catch (error) {
            console.error('Error in mission listener:', error);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error fetching mission progress:', error);
    }
  }

  // Fetch available rewards from GameLayer
  private async fetchRewards(): Promise<void> {
    try {
      const rewards = await gameLayerApi.getPrizes();
      
      if (rewards && Array.isArray(rewards)) {
        console.log('🏆 Updated rewards from GameLayer:', {
          rewardCount: rewards.length
        });

        // Notify all reward listeners
        this.rewardListeners.forEach(callback => {
          try {
            callback(rewards);
          } catch (error) {
            console.error('Error in reward listener:', error);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error fetching rewards:', error);
    }
  }

  // Fetch player's redeemed prizes from GameLayer
  private async fetchPlayerPrizes(): Promise<void> {
    try {
      const prizes = await gameLayerApi.getPlayerPrizes(this.currentPlayerId || undefined);
      
      if (prizes && Array.isArray(prizes)) {
        console.log('🎁 Updated player prizes from GameLayer:', {
          prizeCount: prizes.length
        });

        // Notify all prize listeners
        this.prizeListeners.forEach(callback => {
          try {
            callback(prizes);
          } catch (error) {
            console.error('Error in prize listener:', error);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error fetching player prizes:', error);
    }
  }

  // Get current polling status
  getPollingStatus(): {
    isPolling: boolean;
    playerId: string | null;
    listenerCount: number;
  } {
    return {
      isPolling: this.isPolling,
      playerId: this.currentPlayerId,
      listenerCount: this.listeners.size
    };
  }

  // Manual refresh
  async refreshPlayerData(): Promise<void> {
    console.log('🔄 Manual player data refresh...');
    await this.fetchPlayerData();
  }
}

// Export singleton instance
export const playerDataPollingService = PlayerDataPollingService.getInstance();
export default playerDataPollingService;
