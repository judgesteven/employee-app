import { gameLayerApi } from './gameLayerApi';

// Check if we're on an Android device (or simulating one)
const IS_ANDROID_DEVICE = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);

export const googleFitIntegration = {
  isAvailable(): boolean {
    // In a native Android app, this would check if Google Fit/Health Connect is available
    return IS_ANDROID_DEVICE || !IS_ANDROID_DEVICE; // For web testing, make it available on all devices
  },

  async requestPermissions(): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
        console.warn('Google Fit is not available on this device.');
        return false;
      }

      // In a native Android app, this would use Google Fit API or Health Connect
      // For now, we'll simulate the permission request
      console.log('Requesting Google Fit permissions...');

      // Simulate permission dialog
      return new Promise((resolve) => {
        setTimeout(() => {
          // In a real Android app, this would use Google Fit's authorization request
          // For web simulation, we'll automatically grant permissions for testing
          const granted = true; // Simulate user granting permissions
          console.log('Google Fit permissions:', granted ? 'granted' : 'denied');
          resolve(granted);
        }, 1000);
      });
    } catch (error) {
      console.error('Error requesting Google Fit permissions:', error);
      return false;
    }
  },

  async getCurrentStepCount(): Promise<number> {
    // In a native Android app, this would query Google Fit for current steps
    // For web simulation, we'll return a mock value
    return Math.floor(Math.random() * 12000);
  },

  async startTrackingSteps(onStepTracked: (stepCount: number) => void): Promise<() => void> {
    console.log('Starting Google Fit step tracking simulation...');
    let simulatedSteps = 0;
    const interval = setInterval(async () => {
      simulatedSteps += 1;
      console.log(`Google Fit: Simulating step ${simulatedSteps}`);
      await gameLayerApi.trackStep(); // Send individual step to GameLayer
      onStepTracked(simulatedSteps);
    }, 4000); // Simulate a step every 4 seconds (slightly different from Apple Health)

    return () => {
      clearInterval(interval);
      console.log('Stopped Google Fit step tracking simulation.');
    };
  },

  async syncHistoricalSteps(days: number = 7): Promise<number> {
    console.log(`Google Fit: Syncing historical steps for the last ${days} days...`);
    const totalSyncedSteps = Math.floor(Math.random() * 60000); // Simulate a large number of steps
    await gameLayerApi.trackSteps(gameLayerApi.PLAYER_ID, totalSyncedSteps); // Send batch steps to GameLayer
    console.log(`Google Fit: Synced ${totalSyncedSteps} historical steps.`);
    return totalSyncedSteps;
  },

  // Additional Google Fit specific methods
  async getWeeklySteps(): Promise<number> {
    console.log('Google Fit: Getting weekly steps...');
    return Math.floor(Math.random() * 70000);
  },

  async getMonthlySteps(): Promise<number> {
    console.log('Google Fit: Getting monthly steps...');
    return Math.floor(Math.random() * 300000);
  },

  // Simulate Google Fit's additional health data capabilities
  async getHeartRate(): Promise<number | null> {
    // Google Fit can also track heart rate data
    return Math.floor(Math.random() * 40) + 60; // 60-100 BPM
  },

  async getCalories(): Promise<number | null> {
    // Google Fit tracks calories burned
    return Math.floor(Math.random() * 2000) + 1500; // 1500-3500 calories
  },
};

export default googleFitIntegration;