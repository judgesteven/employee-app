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
    } catch (error) {
      console.error('❌ Error fetching player data:', error);
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
