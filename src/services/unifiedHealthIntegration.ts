import { appleHealthIntegration } from './appleHealthIntegration';
import { googleFitIntegration } from './googleFitIntegration';

export type HealthDataSource = 'apple-health' | 'google-fit';

export interface HealthIntegrationService {
  isAvailable(): boolean;
  requestPermissions(): Promise<boolean>;
  getCurrentStepCount(): Promise<number>;
  startTrackingSteps(onStepTracked: (stepCount: number) => void): Promise<() => void>;
  syncHistoricalSteps(days?: number): Promise<number>;
}

class UnifiedHealthIntegration {
  private currentSource: HealthDataSource;
  private activeTrackingStopFn: (() => void) | null = null;

  constructor() {
    // Default to Apple Health if available, otherwise Google Fit
    this.currentSource = this.getDefaultHealthSource();
  }

  private getDefaultHealthSource(): HealthDataSource {
    const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);
    
    if (isIOS && appleHealthIntegration.isAvailable()) {
      return 'apple-health';
    } else if (isAndroid && googleFitIntegration.isAvailable()) {
      return 'google-fit';
    } else {
      // For web testing, default to Apple Health
      return 'apple-health';
    }
  }

  getCurrentSource(): HealthDataSource {
    return this.currentSource;
  }

  async setHealthSource(source: HealthDataSource): Promise<boolean> {
    // Stop any active tracking before switching
    if (this.activeTrackingStopFn) {
      this.activeTrackingStopFn();
      this.activeTrackingStopFn = null;
    }

    this.currentSource = source;
    
    // Check if the new source is available
    const service = this.getService();
    if (!service.isAvailable()) {
      console.warn(`${source} is not available on this device`);
      return false;
    }

    return true;
  }

  private getService(): HealthIntegrationService {
    switch (this.currentSource) {
      case 'apple-health':
        return appleHealthIntegration;
      case 'google-fit':
        return googleFitIntegration;
      default:
        return appleHealthIntegration;
    }
  }

  isAvailable(): boolean {
    return this.getService().isAvailable();
  }

  async requestPermissions(): Promise<boolean> {
    return this.getService().requestPermissions();
  }

  async getCurrentStepCount(): Promise<number> {
    return this.getService().getCurrentStepCount();
  }

  async startTrackingSteps(onStepTracked: (stepCount: number) => void): Promise<() => void> {
    // Stop any existing tracking first
    if (this.activeTrackingStopFn) {
      this.activeTrackingStopFn();
    }

    const stopFn = await this.getService().startTrackingSteps(onStepTracked);
    
    // Wrap the stop function to clear our reference
    this.activeTrackingStopFn = () => {
      stopFn();
      this.activeTrackingStopFn = null;
    };

    return this.activeTrackingStopFn;
  }

  async syncHistoricalSteps(days: number = 7): Promise<number> {
    return this.getService().syncHistoricalSteps(days);
  }

  stopTracking(): void {
    if (this.activeTrackingStopFn) {
      this.activeTrackingStopFn();
      this.activeTrackingStopFn = null;
    }
  }

  getAvailableSources(): HealthDataSource[] {
    const sources: HealthDataSource[] = [];
    
    if (appleHealthIntegration.isAvailable()) {
      sources.push('apple-health');
    }
    
    if (googleFitIntegration.isAvailable()) {
      sources.push('google-fit');
    }

    return sources;
  }

  getSourceDisplayName(source: HealthDataSource): string {
    switch (source) {
      case 'apple-health':
        return 'Apple Health';
      case 'google-fit':
        return 'Google Fit';
      default:
        return 'Unknown';
    }
  }
}

// Export a singleton instance
export const unifiedHealthIntegration = new UnifiedHealthIntegration();
export default unifiedHealthIntegration;

