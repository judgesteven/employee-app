import { gameLayerApi } from './gameLayerApi';

// Google Fit Web API configuration
const GOOGLE_FIT_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '698221276290-ocvlgt13mj6oegq4lt8ij5btld052l7c.apps.googleusercontent.com',
  SCOPE: 'https://www.googleapis.com/auth/fitness.activity.read',
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest'
};


class GoogleFitWebServiceGIS {
  private static instance: GoogleFitWebServiceGIS;
  private gapi: any = null;
  private tokenClient: any = null;
  private accessToken: string | null = null;
  private isInitialized = false;
  private isAuthorized = false;
  private isTracking = false;
  private lastStepCount = 0;
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastResetDate = '';

  // Storage keys for persistence
  private readonly STORAGE_KEYS = {
    ACCESS_TOKEN: 'googleFit_accessToken',
    IS_AUTHORIZED: 'googleFit_isAuthorized',
    IS_TRACKING: 'googleFit_isTracking',
    LAST_STEP_COUNT: 'googleFit_lastStepCount',
    LAST_RESET_DATE: 'googleFit_lastResetDate'
  };

  static getInstance(): GoogleFitWebServiceGIS {
    if (!GoogleFitWebServiceGIS.instance) {
      GoogleFitWebServiceGIS.instance = new GoogleFitWebServiceGIS();
    }
    return GoogleFitWebServiceGIS.instance;
  }

  constructor() {
    // Load persisted state on initialization
    this.loadState();
  }

  // Save state to localStorage
  private saveState(): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.ACCESS_TOKEN, this.accessToken || '');
      localStorage.setItem(this.STORAGE_KEYS.IS_AUTHORIZED, this.isAuthorized.toString());
      localStorage.setItem(this.STORAGE_KEYS.IS_TRACKING, this.isTracking.toString());
      localStorage.setItem(this.STORAGE_KEYS.LAST_STEP_COUNT, this.lastStepCount.toString());
      localStorage.setItem(this.STORAGE_KEYS.LAST_RESET_DATE, this.lastResetDate);
    } catch (error) {
      console.warn('Failed to save Google Fit state to localStorage:', error);
    }
  }

  // Load state from localStorage
  private loadState(): void {
    try {
      const accessToken = localStorage.getItem(this.STORAGE_KEYS.ACCESS_TOKEN);
      const isAuthorized = localStorage.getItem(this.STORAGE_KEYS.IS_AUTHORIZED) === 'true';
      const isTracking = localStorage.getItem(this.STORAGE_KEYS.IS_TRACKING) === 'true';
      const lastStepCount = parseInt(localStorage.getItem(this.STORAGE_KEYS.LAST_STEP_COUNT) || '0');
      const lastResetDate = localStorage.getItem(this.STORAGE_KEYS.LAST_RESET_DATE) || '';

      if (accessToken) {
        this.accessToken = accessToken;
        this.isAuthorized = isAuthorized;
        this.isTracking = isTracking;
        this.lastStepCount = lastStepCount;
        this.lastResetDate = lastResetDate;
        
        console.log('🔄 Loaded Google Fit state from localStorage:', {
          isAuthorized: this.isAuthorized,
          isTracking: this.isTracking,
          lastStepCount: this.lastStepCount
        });
      }
    } catch (error) {
      console.warn('Failed to load Google Fit state from localStorage:', error);
    }
  }

  // Initialize Google API with Google Identity Services (GIS)
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      console.log('🔄 Initializing Google Fit Web API with GIS...');
      console.log('📋 Configuration:', {
        clientId: GOOGLE_FIT_CONFIG.CLIENT_ID,
        scope: GOOGLE_FIT_CONFIG.SCOPE,
        hasClientId: !!GOOGLE_FIT_CONFIG.CLIENT_ID && GOOGLE_FIT_CONFIG.CLIENT_ID !== 'your-google-client-id',
        environment: process.env.NODE_ENV,
        location: window.location.origin
      });

      // Check if Client ID is configured
      if (!GOOGLE_FIT_CONFIG.CLIENT_ID || GOOGLE_FIT_CONFIG.CLIENT_ID === 'your-google-client-id') {
        console.error('❌ Google Client ID not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file');
        throw new Error('Google Client ID not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file');
      }

      // Load Google Identity Services script
      if (!window.google?.accounts?.oauth2) {
        console.log('📦 Loading Google Identity Services script...');
        await this.loadGoogleIdentityScript();
        console.log('✅ Google Identity Services script loaded');
      }

      // Load GAPI for Fitness API calls
      if (!window.gapi) {
        console.log('📦 Loading Google API script...');
        await this.loadGoogleAPIScript();
        console.log('✅ Google API script loaded');
      }

      // Initialize GAPI client (without auth)
      console.log('🔧 Loading Google API client...');
      await new Promise((resolve, reject) => {
        window.gapi.load('client', {
          callback: resolve,
          onerror: reject
        });
      });

      await window.gapi.client.init({
        discoveryDocs: [GOOGLE_FIT_CONFIG.DISCOVERY_DOC],
      });

      // Initialize Google Identity Services token client
      console.log('🔑 Initializing GIS token client...');
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_FIT_CONFIG.CLIENT_ID,
        scope: GOOGLE_FIT_CONFIG.SCOPE,
        callback: (tokenResponse: any) => {
          console.log('✅ Token received:', tokenResponse);
          this.accessToken = tokenResponse.access_token;
          this.isAuthorized = true;
          this.saveState();
          this.notifyStatusChange();
        },
      });

      this.gapi = window.gapi;
      this.isInitialized = true;
      console.log('✅ Google Fit Web API initialized successfully with GIS');
      
      // Resume tracking if it was previously active
      if (this.isAuthorized && this.isTracking && !this.pollingInterval) {
        console.log('🔄 Resuming step tracking from previous session...');
        // Use setTimeout to ensure initialization is complete
        setTimeout(() => {
          this.startTracking();
        }, 1000);
      }
      
      return true;
    } catch (error: any) {
      console.error('❌ Error initializing Google Fit Web API:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  // Load Google Identity Services script
  private loadGoogleIdentityScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
      document.head.appendChild(script);
    });
  }

  // Load Google API script
  private loadGoogleAPIScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  // Sign in using GIS
  async signIn(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        console.error('❌ Google Fit not initialized');
        return false;
      }

      console.log('🔐 Starting sign in process...');
      
      // Request access token using GIS
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
      
      // The callback will handle the token response
      return true;
    } catch (error) {
      console.error('❌ Error during sign in:', error);
      return false;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      // Clear the access token and authorization state
      this.accessToken = null;
      this.isAuthorized = false;
      this.stopTracking();
      this.saveState();
      console.log('✅ Signed out successfully');
      this.notifyStatusChange();
    } catch (error) {
      console.error('❌ Error during sign out:', error);
    }
  }

  // Check if API is ready
  async isApiReady(): Promise<boolean> {
    return this.isInitialized;
  }

  // Check if user is authorized
  async isUserAuthorized(): Promise<boolean> {
    return this.isAuthorized && !!this.accessToken;
  }

  // Get current daily steps from Google Fit
  async getCurrentDailySteps(): Promise<number> {
    try {
      if (!this.isAuthorized || !this.accessToken) {
        console.warn('⚠️ Not authorized to access Google Fit data');
        return 0;
      }

      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      // Set the access token for GAPI requests
      this.gapi.client.setToken({ access_token: this.accessToken });

      const request = {
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 1 day
        startTimeMillis: startOfDay.getTime(),
        endTimeMillis: endOfDay.getTime()
      };

      const response = await this.gapi.client.fitness.users.dataset.aggregate({
        userId: 'me',
        resource: request
      });

      let totalSteps = 0;
      if (response.result.bucket) {
        for (const bucket of response.result.bucket) {
          if (bucket.dataset && bucket.dataset[0] && bucket.dataset[0].point) {
            for (const point of bucket.dataset[0].point) {
              if (point.value && point.value[0] && point.value[0].intVal) {
                totalSteps += point.value[0].intVal;
              }
            }
          }
        }
      }

      console.log(`📊 Current daily steps: ${totalSteps}`);
      return totalSteps;
    } catch (error) {
      console.error('❌ Error fetching step data:', error);
      return 0;
    }
  }

  // Start tracking steps
  async startTracking(): Promise<boolean> {
    try {
      if (!this.isAuthorized) {
        console.error('❌ Not authorized to track steps');
        return false;
      }

      if (this.isTracking) {
        console.log('ℹ️ Step tracking is already active');
        return true;
      }

      console.log('▶️ Starting step tracking...');
      this.isTracking = true;

      // Get initial step count
      this.lastStepCount = await this.getCurrentDailySteps();
      
      // Check for midnight reset
      const today = new Date().toDateString();
      if (this.lastResetDate !== today) {
        this.lastResetDate = today;
        this.lastStepCount = 0;
        console.log('🌅 Midnight reset detected, resetting step count');
      }

      // Start polling every 5 seconds for more responsive updates
      this.pollingInterval = setInterval(async () => {
        try {
          // Re-check authorization status
          if (!this.isAuthorized || !this.accessToken) {
            console.warn('⚠️ Google Fit authorization lost during tracking');
            this.stopTracking();
            return;
          }

          const currentSteps = await this.getCurrentDailySteps();
          const stepDelta = currentSteps - this.lastStepCount;

          if (stepDelta > 0) {
            console.log(`👟 Step delta detected: +${stepDelta} steps (Total: ${currentSteps})`);
            
            // Send to GameLayer with retry logic
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount < maxRetries) {
              try {
                await gameLayerApi.trackSteps(undefined, stepDelta);
                console.log(`✅ Sent ${stepDelta} steps to GameLayer (attempt ${retryCount + 1})`);
                break;
              } catch (apiError) {
                retryCount++;
                console.error(`❌ Failed to send steps to GameLayer (attempt ${retryCount}):`, apiError);
                if (retryCount >= maxRetries) {
                  console.error('❌ Max retries reached, step data may be lost');
                } else {
                  // Wait before retry
                  await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
              }
            }

            this.lastStepCount = currentSteps;
            this.saveState(); // Save updated step count
            
            // Dispatch custom event
            this.notifyStepTracked(currentSteps);
          }

          // Check for midnight reset
          const currentDate = new Date().toDateString();
          if (this.lastResetDate !== currentDate) {
            this.lastResetDate = currentDate;
            this.lastStepCount = 0;
            this.saveState();
            console.log('🌅 Midnight reset detected, resetting step count');
          }
        } catch (error) {
          console.error('❌ Error during step tracking poll:', error);
          
          // If we get auth errors, try to re-initialize
          if (error instanceof Error && error.message && error.message.includes('auth')) {
            console.log('🔄 Attempting to re-initialize Google Fit due to auth error...');
            this.isInitialized = false;
            this.initialize().catch(initError => {
              console.error('❌ Failed to re-initialize Google Fit:', initError);
            });
          }
        }
      }, 5000); // Poll every 5 seconds for faster updates

      console.log('✅ Step tracking started');
      this.saveState();
      this.notifyStatusChange();
      return true;
    } catch (error) {
      console.error('❌ Error starting step tracking:', error);
      this.isTracking = false;
      return false;
    }
  }

  // Stop tracking steps
  stopTracking(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isTracking = false;
    this.saveState();
    console.log('⏹️ Step tracking stopped');
    this.notifyStatusChange();
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

  // Manual sync
  async manualSync(): Promise<void> {
    if (!this.isAuthorized || !this.isTracking) {
      console.warn('⚠️ Cannot sync: not authorized or not tracking');
      return;
    }

    try {
      const currentSteps = await this.getCurrentDailySteps();
      const stepDelta = currentSteps - this.lastStepCount;

      if (stepDelta > 0) {
        console.log(`🔄 Manual sync: +${stepDelta} steps`);
        await gameLayerApi.trackSteps(undefined, stepDelta);
        this.lastStepCount = currentSteps;
        this.notifyStepTracked(currentSteps);
        console.log('✅ Manual sync completed');
      } else {
        console.log('ℹ️ No new steps to sync');
      }
    } catch (error) {
      console.error('❌ Error during manual sync:', error);
    }
  }

  // Notify step tracked (custom event)
  private notifyStepTracked(stepCount: number): void {
    const event = new CustomEvent('googleFitStepTracked', {
      detail: { stepCount }
    });
    window.dispatchEvent(event);
  }

  // Notify status change
  private notifyStatusChange(): void {
    // This can be used by components to update their state
    const event = new CustomEvent('googleFitStatusChange', {
      detail: this.getTrackingStatus()
    });
    window.dispatchEvent(event);
  }
}

// Export singleton instance
export const googleFitWebServiceGIS = GoogleFitWebServiceGIS.getInstance();
export default googleFitWebServiceGIS;
