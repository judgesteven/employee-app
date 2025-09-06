import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Square, Activity, Plus, Minus } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Button } from '../../styles/GlobalStyles';
import { unifiedHealthService } from '../../services/unifiedHealthService';

const TrackerContainer = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
`;

const TrackerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const TrackerTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const StatusMessage = styled.div`
  padding: ${theme.spacing.sm};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${theme.spacing.md};
`;

const ManualInputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const StepInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
`;

const StepInputButton = styled(Button)`
  min-width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepInput = styled.input`
  flex: 1;
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  border: none;
  background: transparent;
  color: ${theme.colors.text.primary};
  
  &:focus {
    outline: none;
  }
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const SingleButtonRow = styled.div`
  display: flex;
  width: 100%;
`;

const StepCounter = styled(motion.div)`
  text-align: center;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.gradients.primary};
  color: ${theme.colors.text.inverse};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.md};
`;

const StepCount = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: 1;
  margin-bottom: ${theme.spacing.xs};
`;

const StepLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  opacity: 0.8;
`;

interface StepTrackerProps {
  onStepTracked?: (stepCount: number) => void;
}

export const StepTracker: React.FC<StepTrackerProps> = ({ onStepTracked }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string>('');

  useEffect(() => {
    // Load initial state from health service
    const status = unifiedHealthService.getStatus();
    setIsTracking(status.isTracking);
    setCurrentSteps(status.stepsTracked);
    setIsAvailable(status.isAvailable);
    setPermissionsGranted(status.permissionsGranted);
    setCurrentProvider(unifiedHealthService.getProviderDisplayName());

    // Listen for step updates from health service
    const handleStepUpdate = (event: CustomEvent) => {
      const { stepCount } = event.detail;
      setCurrentSteps(stepCount);
      onStepTracked?.(stepCount);
    };

    // Listen for provider changes
    const handleProviderChange = () => {
      const status = unifiedHealthService.getStatus();
      setCurrentProvider(unifiedHealthService.getProviderDisplayName());
      setIsAvailable(status.isAvailable);
      setPermissionsGranted(status.permissionsGranted);
    };

    window.addEventListener('unifiedStepTracked', handleStepUpdate as EventListener);
    window.addEventListener('healthProviderChanged', handleProviderChange as EventListener);

    return () => {
      window.removeEventListener('unifiedStepTracked', handleStepUpdate as EventListener);
      window.removeEventListener('healthProviderChanged', handleProviderChange as EventListener);
    };
  }, [onStepTracked]);

  const handleStartTracking = async () => {
    try {
      // Request permissions first if not granted
      if (!permissionsGranted) {
        const granted = await unifiedHealthService.requestPermissions();
        if (!granted) {
          console.error('Health permissions not granted');
          return;
        }
        setPermissionsGranted(true);
      }

      // Start tracking
      const success = await unifiedHealthService.startTracking();
      if (success) {
        setIsTracking(true);
        console.log(`✅ Started ${currentProvider} step tracking`);
      }
    } catch (error) {
      console.error('Error starting step tracking:', error);
    }
  };

  const handleStopTracking = async () => {
    try {
      await unifiedHealthService.stopTracking();
      setIsTracking(false);
      console.log(`⏹️ Stopped ${currentProvider} step tracking`);
    } catch (error) {
      console.error('Error stopping step tracking:', error);
    }
  };

  const handleAddSteps = () => {
    // Keep manual adjustment as backup
    const newSteps = currentSteps + 100;
    setCurrentSteps(newSteps);
    onStepTracked?.(newSteps);
  };

  const handleSubtractSteps = () => {
    // Keep manual adjustment as backup
    const newSteps = Math.max(0, currentSteps - 100);
    setCurrentSteps(newSteps);
    onStepTracked?.(newSteps);
  };

  const handleStepsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep manual input as backup
    const value = parseInt(e.target.value) || 0;
    setCurrentSteps(value);
    onStepTracked?.(value);
  };


  return (
    <TrackerContainer>
      <TrackerHeader>
        <Activity color={theme.colors.primary} size={24} />
        <TrackerTitle>{currentProvider} Step Tracking</TrackerTitle>
      </TrackerHeader>

      {/* Show availability status */}
      {!isAvailable && (
        <StatusMessage>
          ⚠️ {currentProvider} is not available on this device
        </StatusMessage>
      )}

      {isAvailable && !permissionsGranted && !isTracking && (
        <StatusMessage>
          🔒 {currentProvider} permissions required
        </StatusMessage>
      )}

      {/* Display current steps */}
      {currentSteps > 0 && (
        <StepCounter
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <StepCount>{currentSteps.toLocaleString()}</StepCount>
          <StepLabel>{isTracking ? `steps from ${currentProvider} (auto-syncs to GameLayer)` : 'total steps today'}</StepLabel>
        </StepCounter>
      )}

      <ManualInputSection>
        <StepInputRow>
          <StepInputButton
            variant="secondary"
            onClick={handleSubtractSteps}
          >
            <Minus size={20} />
          </StepInputButton>
          
          <StepInput
            type="number"
            value={currentSteps}
            onChange={handleStepsInputChange}
            placeholder="0"
            min="0"
          />
          
          <StepInputButton
            variant="secondary"
            onClick={handleAddSteps}
          >
            <Plus size={20} />
          </StepInputButton>
        </StepInputRow>
      </ManualInputSection>

      <ControlsSection>
        <SingleButtonRow>
          {!isTracking ? (
            <Button
              variant="primary"
              onClick={handleStartTracking}
              fullWidth
            >
              <Play size={16} />
              {permissionsGranted ? `Start ${currentProvider} Tracking` : `Connect ${currentProvider}`}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={handleStopTracking}
              fullWidth
            >
              <Square size={16} />
              Disable Tracking
            </Button>
          )}
        </SingleButtonRow>
      </ControlsSection>
    </TrackerContainer>
  );
};