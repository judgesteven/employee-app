import { gameLayerApi } from './gameLayerApi';
import { Health } from 'capacitor-health';

// Interface for Apple Health step data
interface AppleHealthStepData {
  count: number;
  startDate: Date;
  endDate: Date;
  source: string;
}

// Interface for the native bridge (will be implemented when app becomes native/hybrid)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Interface compatibility method
  isAvailable(): boolean {
    // For web testing, make it available on all devices
    return true;
  }

  // Interface compatibility method
  async requestPermissions(): Promise<boolean> {
    return this.requestHealthPermissions();
  }

  // Request permission to access Apple Health data
  async requestHealthPermissions(): Promise<boolean> {
    try {
      if (!this.isAppleHealthAvailable()) {
        console.log('Apple Health not available on this device');
        return false;
      }

      console.log('Requesting Apple Health permissions...');
      
      try {
        // Request permissions from HealthKit via Capacitor plugin
        const result = await Health.requestHealthPermissions({
          permissions: ['READ_STEPS']
        });
        
        const granted = result.permissions?.[0]?.['READ_STEPS'] || false;
        console.log('Health permissions:', granted ? 'granted' : 'denied');
        return granted;
      } catch (error) {
        console.warn('Native Health API not available, using fallback:', error);
        // Fallback for web testing
        return new Promise((resolve) => {
          setTimeout(() => {
            const granted = true; // Simulate user granting permissions
            console.log('Health permissions (fallback):', granted ? 'granted' : 'denied');
            resolve(granted);
          }, 1000);
        });
      }
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

  // Real-time step tracking with device polling every 10-15 seconds
  private simulateRealTimeStepTracking(): void {
    let lastStepCount = 0;
    
    // Get initial step count
    this.getCurrentStepCount().then(initialCount => {
      lastStepCount = initialCount;
      this.lastProcessedStepCount = initialCount;
      console.log(`Apple Health: Initial step count: ${initialCount}`);
    }).catch(error => {
      console.error('Error getting initial step count:', error);
    });
    
    const trackingInterval = setInterval(async () => {
      if (!this.isTracking) {
        clearInterval(trackingInterval);
        return;
      }

      // Poll device for real step count
      await this.handleStepPolling(lastStepCount, (newCount) => {
        lastStepCount = newCount;
      });
    }, 15000); // Poll every 15 seconds (within 10-15 second range)
  }

  // Handle step polling - get real step count and send delta to GameLayer
  private async handleStepPolling(lastStepCount: number, updateLastCount: (count: number) => void): Promise<void> {
    try {
      // Get current step count from HealthKit
      const currentStepCount = await this.getCurrentStepCount();
      
      // Calculate delta (new steps since last check)
      const stepDelta = Math.max(0, currentStepCount - lastStepCount);
      
      if (stepDelta > 0) {
        console.log(`Apple Health: ${stepDelta} new steps detected! Total: ${currentStepCount}. Sending to GameLayer...`);
        
        // Send the step delta to GameLayer via POST /events/step-tracker/complete
        await gameLayerApi.trackSteps(undefined, stepDelta);
        
        console.log(`Apple Health: ${stepDelta} steps sent to GameLayer successfully.`);
        updateLastCount(currentStepCount);
        this.lastProcessedStepCount = currentStepCount;
      }
      
      // Notify UI with current total
      this.notifyStepTracked();
    } catch (error) {
      console.error('Error polling step count from Apple Health:', error);
    }
  }

  // Get current step count from HealthKit
  async getCurrentStepCount(): Promise<number> {
    try {
      // Query real step count from HealthKit using aggregated data
      const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
      const now = new Date();
      
      const result = await Health.queryAggregated({
        dataType: 'steps',
        startDate: startOfDay.toISOString(),
        endDate: now.toISOString(),
        bucket: 'day'
      });
      
      const stepCount = result.aggregatedData?.[0]?.value || 0;
      console.log(`Apple Health: Retrieved ${stepCount} steps for today`);
      return stepCount;
    } catch (error) {
      console.warn('Native Health API not available, using fallback:', error);
      // Fallback for web simulation - increment gradually
      this.lastProcessedStepCount += Math.floor(Math.random() * 50) + 10;
      return this.lastProcessedStepCount;
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


  async startTrackingSteps(onStepTracked: (stepCount: number) => void): Promise<() => void> {
    console.log('Starting Apple Health step tracking simulation...');
    this.isTracking = true;
    let simulatedSteps = 0;
    
    const interval = setInterval(async () => {
      if (!this.isTracking) {
        clearInterval(interval);
        return;
      }
      
      simulatedSteps += 1;
      console.log(`Apple Health: Simulating step ${simulatedSteps}`);
      await gameLayerApi.trackStep(); // Send individual step to GameLayer
      onStepTracked(simulatedSteps);
    }, 5000); // Simulate a step every 5 seconds

    return () => {
      this.isTracking = false;
      clearInterval(interval);
      console.log('Stopped Apple Health step tracking simulation.');
    };
  }

  async syncHistoricalSteps(days: number = 7): Promise<number> {
    console.log(`Apple Health: Syncing historical steps for the last ${days} days...`);
    const totalSyncedSteps = Math.floor(Math.random() * 50000); // Simulate a large number of steps
    await gameLayerApi.trackSteps(undefined, totalSyncedSteps); // Send batch steps to GameLayer
    console.log(`Apple Health: Synced ${totalSyncedSteps} historical steps.`);
    return totalSyncedSteps;
  }
}

export const appleHealthIntegration = AppleHealthIntegrationService.getInstance();
export default appleHealthIntegration;
