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

  // Load provider preference from localStorage or auto-detect
  private loadProviderPreference(): HealthProvider {
    const saved = localStorage.getItem('healthProvider') as HealthProvider;
    if (saved && (saved === 'apple_health' || saved === 'google_fit')) {
      return saved;
    }

    // Auto-detect based on platform
    if (appleHealthIntegration.isAppleHealthAvailable()) {
      return 'apple_health';
    } else if (googleFitIntegration.isGoogleFitAvailable()) {
      return 'google_fit';
    }

    // Default to Google Fit for web
    return 'google_fit';
  }

  // Save provider preference to localStorage
  private saveProviderPreference(provider: HealthProvider): void {
    localStorage.setItem('healthProvider', provider);
  }

  // Setup event listeners for both services
  private setupEventListeners(): void {
    // Listen for Apple Health step events
    window.addEventListener('stepTracked', (event: CustomEvent) => {
      if (this.currentProvider === 'apple_health') {
        this.notifyStepTracked(event.detail.stepCount, 'apple_health');
      }
    });

    // Listen for Google Fit step events
    window.addEventListener('googleFitStepTracked', (event: CustomEvent) => {
      if (this.currentProvider === 'google_fit') {
        this.notifyStepTracked(event.detail.stepCount, 'google_fit');
      }
    });
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
        return googleFitIntegration.isGoogleFitAvailable();
      default:
        return false;
    }
  }

  // Get available providers
  getAvailableProviders(): { provider: HealthProvider; available: boolean; name: string }[] {
    return [
      {
        provider: 'apple_health',
        available: appleHealthIntegration.isAppleHealthAvailable(),
        name: 'Apple Health'
      },
      {
        provider: 'google_fit',
        available: googleFitIntegration.isGoogleFitAvailable(),
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
          granted = await googleFitIntegration.requestHealthPermissions();
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
          break;
        case 'google_fit':
          success = await googleFitIntegration.startStepTracking();
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
          break;
        case 'google_fit':
          googleFitIntegration.stopStepTracking();
          break;
      }
    } catch (error) {
      console.error('Error stopping tracking:', error);
    }
  }

  // Get current status
  getStatus(): HealthServiceStatus {
    let status = { isTracking: false, stepsTracked: 0 };

    switch (this.currentProvider) {
      case 'apple_health':
        status = appleHealthIntegration.getTrackingStatus();
        break;
      case 'google_fit':
        status = googleFitIntegration.getTrackingStatus();
        break;
    }

    return {
      ...status,
      provider: this.currentProvider,
      isAvailable: this.isCurrentProviderAvailable(),
      permissionsGranted: this.permissionsStatus[this.currentProvider] || status.isTracking
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
