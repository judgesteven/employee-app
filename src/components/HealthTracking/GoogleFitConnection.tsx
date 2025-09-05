import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Activity, Play, Square, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { theme } from '../../styles/theme';
import { googleFitWebService } from '../../services/googleFitWebIntegration';

const ConnectionContainer = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
`;

const ConnectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const ConnectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ConnectionDescription = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.lg} 0;
  line-height: 1.5;
`;

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const StatusItem = styled.div<{ $status: 'success' | 'warning' | 'error' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  background: ${props => {
    switch (props.$status) {
      case 'success': return 'rgba(34, 197, 94, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'error': return 'rgba(239, 68, 68, 0.1)';
      default: return theme.colors.surfaceHover;
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'success': return 'rgba(34, 197, 94, 0.2)';
      case 'warning': return 'rgba(245, 158, 11, 0.2)';
      case 'error': return 'rgba(239, 68, 68, 0.2)';
      default: return theme.colors.border;
    }
  }};
`;

const StatusIcon = styled.div<{ $status: 'success' | 'warning' | 'error' | 'neutral' }>`
  color: ${props => {
    switch (props.$status) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return theme.colors.text.secondary;
    }
  }};
`;

const StatusText = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  flex: 1;
`;

const StatusValue = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.secondary};
`;

const ControlsSection = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
`;

const ControlButton = styled(motion.button)<{ $variant: 'primary' | 'secondary' | 'danger' }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover { background: ${theme.colors.primary}dd; }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.surfaceHover};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover { background: ${theme.colors.surface}; }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
        `;
      default:
        return '';
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StepCountDisplay = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
  text-align: center;
`;

const StepCountValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const StepCountLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

interface GoogleFitConnectionProps {
  onStatusChange?: (status: any) => void;
}

export const GoogleFitConnection: React.FC<GoogleFitConnectionProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState({
    isInitialized: false,
    isAuthorized: false,
    isTracking: false,
    lastStepCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const updateStatus = React.useCallback(() => {
    const newStatus = googleFitWebService.getTrackingStatus();
    setStatus(newStatus);
    setCurrentStepCount(newStatus.lastStepCount);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  useEffect(() => {
    // Initialize Google Fit service
    const initializeService = async () => {
      await googleFitWebService.initialize();
      updateStatus();
    };

    initializeService();

    // Listen for step tracking events
    const handleStepTracked = (event: CustomEvent) => {
      setCurrentStepCount(event.detail.stepCount);
    };

    window.addEventListener('googleFitStepTracked', handleStepTracked as EventListener);

    // Update status every 5 seconds
    const statusInterval = setInterval(updateStatus, 5000);

    return () => {
      window.removeEventListener('googleFitStepTracked', handleStepTracked as EventListener);
      clearInterval(statusInterval);
    };
  }, [updateStatus]);


  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const success = await googleFitWebService.signIn();
      if (success) {
        console.log('Successfully connected to Google Fit');
      }
    } catch (error) {
      console.error('Error connecting to Google Fit:', error);
    } finally {
      setIsLoading(false);
      updateStatus();
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await googleFitWebService.signOut();
      setCurrentStepCount(0);
    } catch (error) {
      console.error('Error disconnecting from Google Fit:', error);
    } finally {
      setIsLoading(false);
      updateStatus();
    }
  };

  const handleStartTracking = async () => {
    setIsLoading(true);
    try {
      const success = await googleFitWebService.startTracking();
      if (success) {
        console.log('Step tracking started');
      }
    } catch (error) {
      console.error('Error starting step tracking:', error);
    } finally {
      setIsLoading(false);
      updateStatus();
    }
  };

  const handleStopTracking = () => {
    googleFitWebService.stopTracking();
    updateStatus();
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      await googleFitWebService.manualSync();
    } catch (error) {
      console.error('Error during manual sync:', error);
    } finally {
      setIsLoading(false);
      updateStatus();
    }
  };

  return (
    <ConnectionContainer>
      <ConnectionHeader>
        <Activity color={theme.colors.primary} size={24} />
        <ConnectionTitle>Google Fit Connection</ConnectionTitle>
      </ConnectionHeader>

      <ConnectionDescription>
        Connect to Google Fit to automatically track your steps in real-time. Step data is sent securely to GameLayer every 10 seconds.
      </ConnectionDescription>

      <StatusSection>
        <StatusItem $status={status.isInitialized ? 'success' : 'error'}>
          <StatusIcon $status={status.isInitialized ? 'success' : 'error'}>
            {status.isInitialized ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          </StatusIcon>
          <StatusText>Google API</StatusText>
          <StatusValue>{status.isInitialized ? 'Ready' : 'Not Ready'}</StatusValue>
        </StatusItem>

        <StatusItem $status={status.isAuthorized ? 'success' : 'warning'}>
          <StatusIcon $status={status.isAuthorized ? 'success' : 'warning'}>
            {status.isAuthorized ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          </StatusIcon>
          <StatusText>Authorization</StatusText>
          <StatusValue>{status.isAuthorized ? 'Granted' : 'Required'}</StatusValue>
        </StatusItem>

        <StatusItem $status={status.isTracking ? 'success' : 'neutral'}>
          <StatusIcon $status={status.isTracking ? 'success' : 'neutral'}>
            {status.isTracking ? <Play size={16} /> : <Square size={16} />}
          </StatusIcon>
          <StatusText>Step Tracking</StatusText>
          <StatusValue>{status.isTracking ? 'Active' : 'Inactive'}</StatusValue>
        </StatusItem>
      </StatusSection>

      {status.isTracking && (
        <StepCountDisplay>
          <StepCountValue>{currentStepCount.toLocaleString()}</StepCountValue>
          <StepCountLabel>Steps Today</StepCountLabel>
        </StepCountDisplay>
      )}

      <ControlsSection>
        {!status.isAuthorized ? (
          <ControlButton
            $variant="primary"
            onClick={handleConnect}
            disabled={isLoading || !status.isInitialized}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Activity size={16} />}
            Connect to Google Fit
          </ControlButton>
        ) : (
          <>
            {!status.isTracking ? (
              <ControlButton
                $variant="primary"
                onClick={handleStartTracking}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                Start Tracking
              </ControlButton>
            ) : (
              <ControlButton
                $variant="secondary"
                onClick={handleStopTracking}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Square size={16} />
                Stop Tracking
              </ControlButton>
            )}

            <ControlButton
              $variant="secondary"
              onClick={handleManualSync}
              disabled={isLoading || !status.isTracking}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Sync Now
            </ControlButton>

            <ControlButton
              $variant="danger"
              onClick={handleDisconnect}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Disconnect
            </ControlButton>
          </>
        )}
      </ControlsSection>
    </ConnectionContainer>
  );
};
