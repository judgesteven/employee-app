import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Square, Activity, Smartphone, CheckCircle } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Button } from '../../styles/GlobalStyles';
import { unifiedHealthService, HealthProvider } from '../../services/unifiedHealthService';

const TrackerContainer = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
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

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const StatusItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background: ${props => props.$active ? theme.colors.success + '20' : theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${props => props.$active ? theme.colors.success : theme.colors.border};
`;

const StatusIcon = styled.div<{ $active?: boolean }>`
  color: ${props => props.$active ? theme.colors.success : theme.colors.text.secondary};
`;

const StatusText = styled.div`
  flex: 1;
`;

const StatusLabel = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: 2px;
`;

const StatusDescription = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
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
  const [stepsTracked, setStepsTracked] = useState(0);
  const [currentProvider, setCurrentProvider] = useState<HealthProvider>('apple_health');
  const [isProviderAvailable, setIsProviderAvailable] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    // Get initial status
    const updateStatus = () => {
      const status = unifiedHealthService.getStatus();
      setCurrentProvider(status.provider);
      setIsProviderAvailable(status.isAvailable);
      setIsTracking(status.isTracking);
      setStepsTracked(status.stepsTracked);
      setPermissionsGranted(status.permissionsGranted);
    };

    updateStatus();

    // Listen for unified step tracking events
    const handleStepTracked = (event: CustomEvent) => {
      const { stepCount } = event.detail;
      setStepsTracked(stepCount);
      onStepTracked?.(stepCount);
    };

    // Listen for provider changes
    const handleProviderChanged = () => {
      updateStatus();
    };

    window.addEventListener('unifiedStepTracked', handleStepTracked as EventListener);
    window.addEventListener('healthProviderChanged', handleProviderChanged as EventListener);

    return () => {
      window.removeEventListener('unifiedStepTracked', handleStepTracked as EventListener);
      window.removeEventListener('healthProviderChanged', handleProviderChanged as EventListener);
    };
  }, [onStepTracked]);

  const handleStartTracking = async () => {
    const success = await unifiedHealthService.startTracking();
    if (success) {
      setIsTracking(true);
      setPermissionsGranted(true);
    }
  };

  const handleStopTracking = async () => {
    await unifiedHealthService.stopTracking();
    setIsTracking(false);
  };

  const handleRequestPermissions = async () => {
    const granted = await unifiedHealthService.requestPermissions();
    setPermissionsGranted(granted);
  };

  const getProviderDisplayName = () => {
    return unifiedHealthService.getProviderDisplayName(currentProvider);
  };

  const getProviderIcon = () => {
    switch (currentProvider) {
      case 'apple_health':
        return <Smartphone size={20} />;
      case 'google_fit':
        return <Activity size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const getAvailabilityDescription = () => {
    if (!isProviderAvailable) {
      switch (currentProvider) {
        case 'apple_health':
          return 'Not available (requires iOS device)';
        case 'google_fit':
          return 'Not available on this device';
        default:
          return 'Not available';
      }
    }
    return `Available on this device`;
  };

  return (
    <TrackerContainer>
      <TrackerHeader>
        <Activity color={theme.colors.primary} size={24} />
        <TrackerTitle>{getProviderDisplayName()} Step Tracking</TrackerTitle>
      </TrackerHeader>

      {stepsTracked > 0 && (
        <StepCounter
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <StepCount>{stepsTracked}</StepCount>
          <StepLabel>steps tracked to GameLayer</StepLabel>
        </StepCounter>
      )}

      <StatusSection>
        <StatusItem $active={isProviderAvailable}>
          <StatusIcon $active={isProviderAvailable}>
            {getProviderIcon()}
          </StatusIcon>
          <StatusText>
            <StatusLabel>{getProviderDisplayName()} Availability</StatusLabel>
            <StatusDescription>
              {getAvailabilityDescription()}
            </StatusDescription>
          </StatusText>
        </StatusItem>

        <StatusItem $active={permissionsGranted}>
          <StatusIcon $active={permissionsGranted}>
            <CheckCircle size={20} />
          </StatusIcon>
          <StatusText>
            <StatusLabel>Health Permissions</StatusLabel>
            <StatusDescription>
              {permissionsGranted ? 'Granted - can access step data' : 'Permissions required for step tracking'}
            </StatusDescription>
          </StatusText>
        </StatusItem>

        <StatusItem $active={isTracking}>
          <StatusIcon $active={isTracking}>
            <Activity size={20} />
          </StatusIcon>
          <StatusText>
            <StatusLabel>Real-time Tracking</StatusLabel>
            <StatusDescription>
              {isTracking ? 'Active - sending steps to GameLayer' : 'Inactive - not tracking steps'}
            </StatusDescription>
          </StatusText>
        </StatusItem>
      </StatusSection>

      <ControlsSection>
        {!permissionsGranted && isProviderAvailable && (
          <Button
            variant="primary"
            onClick={handleRequestPermissions}
            fullWidth
          >
            Request Health Permissions
          </Button>
        )}

        <SingleButtonRow>
          {!isTracking ? (
            <Button
              variant="primary"
              onClick={handleStartTracking}
              disabled={!isProviderAvailable || !permissionsGranted}
              fullWidth
            >
              <Play size={16} />
              Start Tracking
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={handleStopTracking}
              fullWidth
            >
              <Square size={16} />
              Stop Tracking
            </Button>
          )}
        </SingleButtonRow>
      </ControlsSection>
    </TrackerContainer>
  );
};