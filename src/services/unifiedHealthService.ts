import { appleHealthIntegration } from './appleHealthIntegration';
import { googleFitIntegration } from './googleFitIntegration';

export type HealthProvider = 'apple_health' | 'google_fit';

interface HealthServiceStatus {
  isTracking: boolean;
  stepsTracked: number;
  provider: HealthProvider;
  isAvailable: boolean;
  permissionsGranted: boolean;
}

class UnifiedHealthService {
  private static instance: UnifiedHealthService;
  private currentProvider: HealthProvider;
  private permissionsStatus: Record<HealthProvider, boolean> = {
    apple_health: false,
    google_fit: false
  };
  private trackingStatus: Record<HealthProvider, { isTracking: boolean; stepsTracked: number }> = {
    apple_health: { isTracking: false, stepsTracked: 0 },
    google_fit: { isTracking: false, stepsTracked: 0 }
  };
  private stopTrackingFunctions: Record<HealthProvider, (() => void) | null> = {
    apple_health: null,
    google_fit: null
  };

  static getInstance(): UnifiedHealthService {
    if (!UnifiedHealthService.instance) {
      UnifiedHealthService.instance = new UnifiedHealthService();
    }
    return UnifiedHealthService.instance;
  }

  constructor() {
    // Load saved provider preference or auto-detect
    this.currentProvider = this.loadProviderPreference();
    this.setupEventListeners();
  }

  // Load provider preference from localStorage or default to Google Fit
  private loadProviderPreference(): HealthProvider {
    const saved = localStorage.getItem('healthProvider') as HealthProvider;
    if (saved && saved === 'google_fit') {
      return saved;
    }

    // Always default to Google Fit (Apple Health disabled)
    return 'google_fit';
  }

  // Save provider preference to localStorage
  private saveProviderPreference(provider: HealthProvider): void {
    localStorage.setItem('healthProvider', provider);
  }

  // Setup event listeners for both services
  private setupEventListeners(): void {
    // Listen for Apple Health step events
    window.addEventListener('stepTracked', ((event: CustomEvent) => {
      if (this.currentProvider === 'apple_health') {
        this.trackingStatus.apple_health.stepsTracked = event.detail.stepCount;
        this.notifyStepTracked(event.detail.stepCount, 'apple_health');
      }
    }) as EventListener);

    // Listen for Google Fit step events (handled via callback in startTracking)
  }

  // Get current health provider
  getCurrentProvider(): HealthProvider {
    return this.currentProvider;
  }

  // Set health provider
  async setProvider(provider: HealthProvider): Promise<boolean> {
    try {
      // Stop current tracking if active
      await this.stopTracking();

      // Update provider
      this.currentProvider = provider;
      this.saveProviderPreference(provider);

      console.log(`Switched to health provider: ${provider}`);
      this.notifyProviderChanged(provider);

      return true;
    } catch (error) {
      console.error('Error switching health provider:', error);
      return false;
    }
  }

  // Check if current provider is available
  isCurrentProviderAvailable(): boolean {
    switch (this.currentProvider) {
      case 'apple_health':
        return appleHealthIntegration.isAppleHealthAvailable();
      case 'google_fit':
        return googleFitIntegration.isAvailable();
      default:
        return false;
    }
  }

  // Get available providers (Google Fit only)
  getAvailableProviders(): { provider: HealthProvider; available: boolean; name: string }[] {
    return [
      {
        provider: 'google_fit',
        available: googleFitIntegration.isAvailable(),
        name: 'Google Fit'
      }
    ];
  }

  // Request permissions for current provider
  async requestPermissions(): Promise<boolean> {
    try {
      let granted = false;

      switch (this.currentProvider) {
        case 'apple_health':
          granted = await appleHealthIntegration.requestHealthPermissions();
          break;
        case 'google_fit':
          granted = await googleFitIntegration.requestPermissions();
          break;
      }

      this.permissionsStatus[this.currentProvider] = granted;
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  // Start step tracking with current provider
  async startTracking(): Promise<boolean> {
    try {
      let success = false;

      switch (this.currentProvider) {
        case 'apple_health':
          success = await appleHealthIntegration.startStepTracking();
          if (success) {
            this.trackingStatus.apple_health.isTracking = true;
          }
          break;
        case 'google_fit':
          const stopFunction = await googleFitIntegration.startTrackingSteps((stepCount) => {
            this.trackingStatus.google_fit.stepsTracked = stepCount;
            this.notifyStepTracked(stepCount, 'google_fit');
          });
          this.stopTrackingFunctions.google_fit = stopFunction;
          this.trackingStatus.google_fit.isTracking = true;
          success = true;
          break;
      }

      if (success) {
        this.permissionsStatus[this.currentProvider] = true;
      }

      return success;
    } catch (error) {
      console.error('Error starting tracking:', error);
      return false;
    }
  }

  // Stop step tracking
  async stopTracking(): Promise<void> {
    try {
      switch (this.currentProvider) {
        case 'apple_health':
          appleHealthIntegration.stopStepTracking();
          this.trackingStatus.apple_health.isTracking = false;
          break;
        case 'google_fit':
          if (this.stopTrackingFunctions.google_fit) {
            this.stopTrackingFunctions.google_fit();
            this.stopTrackingFunctions.google_fit = null;
          }
          this.trackingStatus.google_fit.isTracking = false;
          break;
      }
    } catch (error) {
      console.error('Error stopping tracking:', error);
    }
  }

  // Get current status
  getStatus(): HealthServiceStatus {
    const currentTracking = this.trackingStatus[this.currentProvider];

    return {
      isTracking: currentTracking.isTracking,
      stepsTracked: currentTracking.stepsTracked,
      provider: this.currentProvider,
      isAvailable: this.isCurrentProviderAvailable(),
      permissionsGranted: this.permissionsStatus[this.currentProvider] || currentTracking.isTracking
    };
  }

  // Sync historical data
  async syncHistoricalSteps(days: number = 7): Promise<void> {
    try {
      switch (this.currentProvider) {
        case 'apple_health':
          await appleHealthIntegration.syncHistoricalSteps(days);
          break;
        case 'google_fit':
          await googleFitIntegration.syncHistoricalSteps(days);
          break;
      }
    } catch (error) {
      console.error('Error syncing historical steps:', error);
    }
  }

  // Notify about step tracking
  private notifyStepTracked(stepCount: number, provider: HealthProvider): void {
    const event = new CustomEvent('unifiedStepTracked', {
      detail: { stepCount, provider }
    });
    window.dispatchEvent(event);
  }

  // Notify about provider change
  private notifyProviderChanged(provider: HealthProvider): void {
    const event = new CustomEvent('healthProviderChanged', {
      detail: { provider }
    });
    window.dispatchEvent(event);
  }

  // Get provider display name
  getProviderDisplayName(provider?: HealthProvider): string {
    const targetProvider = provider || this.currentProvider;
    switch (targetProvider) {
      case 'apple_health':
        return 'Apple Health';
      case 'google_fit':
        return 'Google Fit';
      default:
        return 'Unknown';
    }
  }
}

export const unifiedHealthService = UnifiedHealthService.getInstance();
export default unifiedHealthService;