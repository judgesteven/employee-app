import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

import { theme } from '../../styles/theme';

const StreakContainer = styled(motion.div)`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  transition: all 0.3s ease;
`;

const StreakHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const StreakTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const StreakTitleText = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const StreakIcon = styled.div`
  color: #FF6B35;
  display: flex;
  align-items: center;
`;

const StreakCount = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: #FF6B35;
`;

const StreakInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
`;

const StreakLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const StreakValue = styled.div`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.surfaceHover};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${theme.spacing.sm};
`;

const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #FF6B35 0%, #FF8E53 100%);
  border-radius: ${theme.borderRadius.full};
  width: ${props => props.progress}%;
`;

interface StreakProgressProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakProgress: React.FC<StreakProgressProps> = ({ 
  currentStreak, 
  longestStreak 
}) => {
  const progressPercentage = longestStreak > 0 ? (currentStreak / longestStreak) * 100 : 0;

  return (
    <StreakContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <StreakHeader>
        <StreakTitle>
          <StreakIcon>
            <Flame size={24} />
          </StreakIcon>
          <StreakTitleText>Streak Stats</StreakTitleText>
        </StreakTitle>
        <StreakCount>{currentStreak}</StreakCount>
      </StreakHeader>
      
      <StreakInfo>
        <StreakLabel>Current Streak</StreakLabel>
        <StreakValue>{currentStreak} days</StreakValue>
      </StreakInfo>
      
      <StreakInfo>
        <StreakLabel>Longest Streak</StreakLabel>
        <StreakValue>{longestStreak} days</StreakValue>
      </StreakInfo>
      
      <ProgressBar>
        <ProgressFill
          progress={progressPercentage}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </ProgressBar>
    </StreakContainer>
  );
};
