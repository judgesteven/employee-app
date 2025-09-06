import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Square, Activity, Plus, Minus } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Button } from '../../styles/GlobalStyles';

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
  const [stepsTracked, setStepsTracked] = useState(0);
  const [dailySteps, setDailySteps] = useState(0);

  const handleStartTracking = () => {
    setIsTracking(true);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  const handleAddSteps = () => {
    const newSteps = dailySteps + 100;
    setDailySteps(newSteps);
    if (isTracking) {
      const newTrackedSteps = stepsTracked + 100;
      setStepsTracked(newTrackedSteps);
      onStepTracked?.(newTrackedSteps);
    }
  };

  const handleSubtractSteps = () => {
    const newSteps = Math.max(0, dailySteps - 100);
    setDailySteps(newSteps);
    if (isTracking) {
      const newTrackedSteps = Math.max(0, stepsTracked - 100);
      setStepsTracked(newTrackedSteps);
      onStepTracked?.(newTrackedSteps);
    }
  };

  const handleStepsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setDailySteps(value);
    if (isTracking) {
      setStepsTracked(value);
      onStepTracked?.(value);
    }
  };

  return (
    <TrackerContainer>
      <TrackerHeader>
        <Activity color={theme.colors.primary} size={24} />
        <TrackerTitle>Manual Step Tracking</TrackerTitle>
      </TrackerHeader>

      {/* Display session steps if tracking */}
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
            value={dailySteps}
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