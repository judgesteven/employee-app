import { gameLayerApi } from './gameLayerApi';

// Interface for Apple Health step data
interface AppleHealthStepData {
  count: number;
  startDate: Date;
  endDate: Date;
  source: string;
}

// Interface for the native bridge (will be implemented when app becomes native/hybrid)
interface AppleHealthBridge {
  requestAuthorization(): Promise<boolean>;
  getStepCount(startDate: Date, endDate: Date): Promise<AppleHealthStepData[]>;
  startStepTracking(callback: (stepData: AppleHealthStepData) => void): void;
  stopStepTracking(): void;
}

class AppleHealthIntegrationService {
  private static instance: AppleHealthIntegrationService;
  private isTracking = false;
  private lastProcessedStepCount = 0;

  static getInstance(): AppleHealthIntegrationService {
    if (!AppleHealthIntegrationService.instance) {
      AppleHealthIntegrationService.instance = new AppleHealthIntegrationService();
    }
    return AppleHealthIntegrationService.instance;
  }

  // Check if Apple Health is available (iOS device)
  isAppleHealthAvailable(): boolean {
    // In a real iOS app, this would check for HealthKit availability
    // For web testing, we'll simulate based on user agent
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // Request permission to access Apple Health data
  async requestHealthPermissions(): Promise<boolean> {
    try {
      if (!this.isAppleHealthAvailable()) {
        console.log('Apple Health not available on this device');
        return false;
      }

      // In a native iOS app, this would use the HealthKit framework
      // For now, we'll simulate the permission request
      console.log('Requesting Apple Health permissions...');
      
      // Simulate permission dialog
      return new Promise((resolve) => {
        setTimeout(() => {
          // In a real iOS app, this would use HealthKit's authorization request
          // For web simulation, we'll automatically grant permissions for testing
          const granted = true; // Simulate user granting permissions
          console.log('Health permissions:', granted ? 'granted' : 'denied');
          resolve(granted);
        }, 1000);
      });
    } catch (error) {
      console.error('Error requesting health permissions:', error);
      return false;
    }
  }

  // Get historical step data from Apple Health
  async getHistoricalSteps(startDate: Date, endDate: Date): Promise<AppleHealthStepData[]> {
    try {
      if (!this.isAppleHealthAvailable()) {
        throw new Error('Apple Health not available');
      }

      // In a native iOS app, this would query HealthKit
      // For simulation, we'll generate mock data
      console.log(`Fetching steps from ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      const mockStepData: AppleHealthStepData[] = [{
        count: Math.floor(Math.random() * 5000) + 2000,
        startDate: startDate,
        endDate: endDate,
        source: 'Apple Health'
      }];

      return mockStepData;
    } catch (error) {
      console.error('Error fetching historical steps:', error);
      return [];
    }
  }

  // Start real-time step tracking
  async startStepTracking(): Promise<boolean> {
    try {
      if (this.isTracking) {
        console.log('Step tracking already active');
        return true;
      }

      const permissionsGranted = await this.requestHealthPermissions();
      if (!permissionsGranted) {
        throw new Error('Health permissions not granted');
      }

      console.log('Starting real-time step tracking...');
      this.isTracking = true;

      // In a native iOS app, this would set up HealthKit observers
      // For simulation, we'll create a mock real-time tracker
      this.simulateRealTimeStepTracking();

      return true;
    } catch (error) {
      console.error('Error starting step tracking:', error);
      return false;
    }
  }

  // Stop real-time step tracking
  stopStepTracking(): void {
    console.log('Stopping step tracking...');
    this.isTracking = false;
  }

  // Simulate real-time step tracking for testing
  private simulateRealTimeStepTracking(): void {
    const trackingInterval = setInterval(() => {
      if (!this.isTracking) {
        clearInterval(trackingInterval);
        return;
      }

      // Simulate detecting a new step
      if (Math.random() > 0.7) { // 30% chance of a step every 5 seconds
        this.handleNewStep();
      }
    }, 5000); // Check every 5 seconds
  }

  // Handle when a new step is detected
  private async handleNewStep(): Promise<void> {
    try {
      console.log('New step detected! Sending to GameLayer...');
      
      // Send the step event to GameLayer
      await gameLayerApi.trackStep();
      
      this.lastProcessedStepCount++;
      console.log(`Step ${this.lastProcessedStepCount} tracked successfully`);
      
      // You could emit an event here for the UI to update
      this.notifyStepTracked();
    } catch (error) {
      console.error('Error tracking step to GameLayer:', error);
    }
  }

  // Sync historical steps with GameLayer
  async syncHistoricalSteps(days: number = 7): Promise<void> {
    try {
      console.log(`Syncing last ${days} days of step data...`);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const stepData = await this.getHistoricalSteps(startDate, endDate);
      
      for (const dayData of stepData) {
        if (dayData.count > 0) {
          console.log(`Syncing ${dayData.count} steps for ${dayData.startDate.toDateString()}`);
          
          // Send steps to GameLayer in batches
          await gameLayerApi.trackSteps(undefined, dayData.count, dayData.startDate);
        }
      }
      
      console.log('Historical step sync completed');
    } catch (error) {
      console.error('Error syncing historical steps:', error);
    }
  }

  // Notify UI components about step tracking
  private notifyStepTracked(): void {
    // Emit custom event that components can listen to
    const event = new CustomEvent('stepTracked', {
      detail: { stepCount: this.lastProcessedStepCount }
    });
    window.dispatchEvent(event);
  }

  // Get current tracking status
  getTrackingStatus(): { isTracking: boolean; stepsTracked: number } {
    return {
      isTracking: this.isTracking,
      stepsTracked: this.lastProcessedStepCount
    };
  }
}

export const appleHealthIntegration = AppleHealthIntegrationService.getInstance();
export default appleHealthIntegration;
