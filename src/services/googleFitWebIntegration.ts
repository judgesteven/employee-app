import { gameLayerApi } from './gameLayerApi';

// Google Fit Web API configuration
const GOOGLE_FIT_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id',
  SCOPE: 'https://www.googleapis.com/auth/fitness.activity.read',
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest'
};

// Interface for step count data (for future use)
// interface StepCountData {
//   totalSteps: number;
//   timestamp: Date;
// }

class GoogleFitWebService {
  private static instance: GoogleFitWebService;
  private gapi: any = null;
  private isInitialized = false;
  private isAuthorized = false;
  private isTracking = false;
  private lastStepCount = 0;
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastResetDate = '';

  static getInstance(): GoogleFitWebService {
    if (!GoogleFitWebService.instance) {
      GoogleFitWebService.instance = new GoogleFitWebService();
    }
    return GoogleFitWebService.instance;
  }

  // Initialize Google API
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      // Load Google API script if not already loaded
      if (!window.gapi) {
        await this.loadGoogleAPIScript();
      }

      await new Promise((resolve) => {
        window.gapi.load('auth2:client', resolve);
      });

      await window.gapi.client.init({
        discoveryDocs: [GOOGLE_FIT_CONFIG.DISCOVERY_DOC],
        clientId: GOOGLE_FIT_CONFIG.CLIENT_ID,
        scope: GOOGLE_FIT_CONFIG.SCOPE
      });

      this.gapi = window.gapi;
      this.isInitialized = true;
      console.log('Google Fit Web API initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Google Fit Web API:', error);
      return false;
    }
  }

  // Load Google API script dynamically
  private loadGoogleAPIScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-api-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-api-script';
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  // Check if user is authorized
  isUserAuthorized(): boolean {
    if (!this.isInitialized || !this.gapi) return false;
    
    const authInstance = this.gapi.auth2.getAuthInstance();
    this.isAuthorized = authInstance.isSignedIn.get();
    return this.isAuthorized;
  }

  // Sign in to Google Fit
  async signIn(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) return false;
      }

      const authInstance = this.gapi.auth2.getAuthInstance();
      
      if (!authInstance.isSignedIn.get()) {
        console.log('Requesting Google Fit authorization...');
        await authInstance.signIn();
      }

      this.isAuthorized = authInstance.isSignedIn.get();
      console.log('Google Fit authorization:', this.isAuthorized ? 'granted' : 'denied');
      
      return this.isAuthorized;
    } catch (error) {
      console.error('Error signing in to Google Fit:', error);
      return false;
    }
  }

  // Sign out from Google Fit
  async signOut(): Promise<void> {
    try {
      if (this.isInitialized && this.gapi) {
        const authInstance = this.gapi.auth2.getAuthInstance();
        await authInstance.signOut();
        this.isAuthorized = false;
        this.stopTracking();
        console.log('Signed out from Google Fit');
      }
    } catch (error) {
      console.error('Error signing out from Google Fit:', error);
    }
  }

  // Get current step count for today
  async getCurrentStepCount(): Promise<number> {
    try {
      if (!this.isAuthorized) {
        console.warn('Not authorized to access Google Fit data');
        return 0;
      }

      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const request = {
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 1 day
        startTimeMillis: startOfDay.getTime(),
        endTimeMillis: now.getTime()
      };

      const response = await this.gapi.client.fitness.users.dataset.aggregate({
        userId: 'me',
        resource: request
      });

      let totalSteps = 0;
      if (response.result.bucket && response.result.bucket.length > 0) {
        const bucket = response.result.bucket[0];
        if (bucket.dataset && bucket.dataset.length > 0) {
          const dataset = bucket.dataset[0];
          if (dataset.point && dataset.point.length > 0) {
            totalSteps = dataset.point.reduce((sum: number, point: any) => {
              return sum + (point.value[0]?.intVal || 0);
            }, 0);
          }
        }
      }

      console.log(`Google Fit: Retrieved ${totalSteps} steps for today`);
      return totalSteps;
    } catch (error) {
      console.error('Error getting step count from Google Fit:', error);
      return 0;
    }
  }

  // Start real-time step tracking
  async startTracking(): Promise<boolean> {
    try {
      if (this.isTracking) {
        console.log('Step tracking already active');
        return true;
      }

      if (!this.isAuthorized) {
        const authorized = await this.signIn();
        if (!authorized) return false;
      }

      // Get initial step count
      this.lastStepCount = await this.getCurrentStepCount();
      this.lastResetDate = new Date().toDateString();
      
      console.log(`Starting Google Fit step tracking. Initial count: ${this.lastStepCount}`);
      
      this.isTracking = true;
      this.startPolling();
      
      return true;
    } catch (error) {
      console.error('Error starting step tracking:', error);
      return false;
    }
  }

  // Stop step tracking
  stopTracking(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isTracking = false;
    console.log('Google Fit step tracking stopped');
  }

  // Start polling for step count changes
  private startPolling(): void {
    // Poll every 10 seconds for real-time updates
    this.pollingInterval = setInterval(async () => {
      await this.pollStepCount();
    }, 10000); // 10 seconds
  }

  // Poll step count and send deltas to GameLayer
  private async pollStepCount(): Promise<void> {
    try {
      // Check if it's a new day - reset if so
      const currentDate = new Date().toDateString();
      if (currentDate !== this.lastResetDate) {
        console.log('New day detected - resetting step count');
        this.lastStepCount = 0;
        this.lastResetDate = currentDate;
      }

      // Get current step count
      const currentStepCount = await this.getCurrentStepCount();
      
      // Calculate delta (new steps since last check)
      const stepDelta = Math.max(0, currentStepCount - this.lastStepCount);
      
      if (stepDelta > 0) {
        console.log(`Google Fit: ${stepDelta} new steps detected! Total: ${currentStepCount}. Sending to GameLayer...`);
        
        try {
          // Send the step delta to GameLayer via POST /events/step-tracker/complete
          await gameLayerApi.trackSteps(undefined, stepDelta);
          
          console.log(`Google Fit: ${stepDelta} steps sent to GameLayer successfully.`);
          this.lastStepCount = currentStepCount;
          
          // Dispatch event for UI updates
          this.notifyStepTracked(currentStepCount);
        } catch (error) {
          console.error('Error sending step data to GameLayer:', error);
        }
      } else {
        // Still notify UI even if no new steps
        this.notifyStepTracked(currentStepCount);
      }
    } catch (error) {
      console.error('Error polling step count:', error);
    }
  }

  // Notify UI components about step tracking
  private notifyStepTracked(stepCount: number): void {
    const event = new CustomEvent('googleFitStepTracked', {
      detail: { stepCount, timestamp: new Date() }
    });
    window.dispatchEvent(event);
  }

  // Get tracking status
  getTrackingStatus(): {
    isInitialized: boolean;
    isAuthorized: boolean;
    isTracking: boolean;
    lastStepCount: number;
  } {
    return {
      isInitialized: this.isInitialized,
      isAuthorized: this.isAuthorized,
      isTracking: this.isTracking,
      lastStepCount: this.lastStepCount
    };
  }

  // Manual sync for testing
  async manualSync(): Promise<void> {
    if (this.isTracking) {
      await this.pollStepCount();
    }
  }
}

// Export singleton instance
export const googleFitWebService = GoogleFitWebService.getInstance();
export default googleFitWebService;
