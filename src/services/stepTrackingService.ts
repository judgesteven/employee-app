class StepTrackingService {
  private static instance: StepTrackingService;
  private isTracking = false;
  private currentSteps = 0;
  private trackingStartTime: number | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: Set<(steps: number) => void> = new Set();

  static getInstance(): StepTrackingService {
    if (!StepTrackingService.instance) {
      StepTrackingService.instance = new StepTrackingService();
    }
    return StepTrackingService.instance;
  }

  constructor() {
    this.loadState();
    this.setupBackgroundTracking();
  }

  // Load tracking state from localStorage
  private loadState() {
    try {
      const savedState = localStorage.getItem('stepTracking');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.isTracking = state.isTracking || false;
        this.currentSteps = state.currentSteps || 0;
        this.trackingStartTime = state.trackingStartTime || null;
        
        console.log('📊 Loaded step tracking state:', {
          isTracking: this.isTracking,
          currentSteps: this.currentSteps,
          trackingStartTime: this.trackingStartTime
        });

        // If we were tracking, resume tracking
        if (this.isTracking) {
          this.resumeTracking();
        }
      }
    } catch (error) {
      console.error('Error loading step tracking state:', error);
    }
  }

  // Save tracking state to localStorage
  private saveState() {
    try {
      const state = {
        isTracking: this.isTracking,
        currentSteps: this.currentSteps,
        trackingStartTime: this.trackingStartTime
      };
      localStorage.setItem('stepTracking', JSON.stringify(state));
      console.log('💾 Saved step tracking state:', state);
    } catch (error) {
      console.error('Error saving step tracking state:', error);
    }
  }

  // Setup background tracking that continues even when app is closed
  private setupBackgroundTracking() {
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('📱 App went to background, continuing step tracking...');
      } else {
        console.log('📱 App came to foreground, syncing steps...');
        this.syncStepsFromBackground();
      }
    });

    // Listen for page unload to save state
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });

    // Periodic sync every 30 seconds
    setInterval(() => {
      if (this.isTracking) {
        this.saveState();
      }
    }, 30000);
  }

  // Sync steps when app comes back to foreground
  private syncStepsFromBackground() {
    if (!this.isTracking || !this.trackingStartTime) return;

    const now = Date.now();
    const timeAwayMs = now - (this.trackingStartTime + (this.currentSteps * 2000)); // Assuming 2 seconds per step
    
    if (timeAwayMs > 0) {
      // Simulate steps gained while away (1 step per 2 seconds on average)
      const stepsGained = Math.floor(timeAwayMs / 2000);
      if (stepsGained > 0) {
        this.currentSteps += stepsGained;
        console.log(`🚶 Gained ${stepsGained} steps while app was in background`);
        this.notifyListeners();
        this.saveState();
      }
    }
  }

  // Resume tracking after app restart
  private resumeTracking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Sync any steps gained while app was closed
    this.syncStepsFromBackground();

    // Start the step simulation
    this.intervalId = setInterval(() => {
      // Simulate realistic step counting (1-3 steps every 2-6 seconds)
      const shouldAddStep = Math.random() > 0.5; // 50% chance
      if (shouldAddStep) {
        const stepsToAdd = Math.floor(Math.random() * 3) + 1; // 1-3 steps
        this.currentSteps += stepsToAdd;
        this.notifyListeners();
        
        // Save state periodically
        if (this.currentSteps % 10 === 0) {
          this.saveState();
        }
      }
    }, 3000); // Check every 3 seconds

    console.log('🏃 Step tracking resumed');
  }

  // Start tracking
  startTracking(): boolean {
    if (this.isTracking) {
      console.log('⚠️ Step tracking already active');
      return true;
    }

    this.isTracking = true;
    this.trackingStartTime = Date.now();
    this.resumeTracking();
    this.saveState();
    
    console.log('🏃 Step tracking started');
    return true;
  }

  // Stop tracking
  stopTracking(): void {
    this.isTracking = false;
    this.trackingStartTime = null;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.saveState();
    console.log('⏹️ Step tracking stopped');
  }

  // Add manual steps
  addSteps(steps: number): void {
    this.currentSteps += steps;
    this.notifyListeners();
    this.saveState();
    console.log(`➕ Added ${steps} manual steps, total: ${this.currentSteps}`);
  }

  // Remove steps
  removeSteps(steps: number): void {
    this.currentSteps = Math.max(0, this.currentSteps - steps);
    this.notifyListeners();
    this.saveState();
    console.log(`➖ Removed ${steps} steps, total: ${this.currentSteps}`);
  }

  // Set steps directly
  setSteps(steps: number): void {
    this.currentSteps = Math.max(0, steps);
    this.notifyListeners();
    this.saveState();
    console.log(`📝 Set steps to: ${this.currentSteps}`);
  }

  // Reset daily steps (call this at midnight)
  resetDailySteps(): void {
    this.currentSteps = 0;
    this.notifyListeners();
    this.saveState();
    console.log('🔄 Daily steps reset');
  }

  // Get current state
  getState() {
    return {
      isTracking: this.isTracking,
      currentSteps: this.currentSteps,
      trackingStartTime: this.trackingStartTime
    };
  }

  // Add listener for step updates
  addListener(callback: (steps: number) => void): void {
    this.listeners.add(callback);
  }

  // Remove listener
  removeListener(callback: (steps: number) => void): void {
    this.listeners.delete(callback);
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentSteps);
      } catch (error) {
        console.error('Error in step tracking listener:', error);
      }
    });
  }

  // Send steps to GameLayer API
  async syncToGameLayer(): Promise<boolean> {
    try {
      console.log(`🎯 Syncing ${this.currentSteps} steps to GameLayer...`);
      // Here you would call your GameLayer API to submit steps
      // For now, just simulate success
      return true;
    } catch (error) {
      console.error('Error syncing steps to GameLayer:', error);
      return false;
    }
  }
}

// Export singleton instance
export const stepTrackingService = StepTrackingService.getInstance();
export default stepTrackingService;
