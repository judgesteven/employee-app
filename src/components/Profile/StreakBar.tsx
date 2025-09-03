import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

const StreakContainer = styled(motion.div)`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  transition: all 0.3s ease;
`;

const StreakInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const StreakIcon = styled.div`
  color: #FF6B35;
  display: flex;
  align-items: center;
  font-size: 24px;
`;

const StreakTitle = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const StreakStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const StreakStat = styled.div`
  text-align: center;
`;

const StreakNumber = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: #FF6B35;
  line-height: 1;
`;

const StreakLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: ${theme.colors.surfaceHover};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin: 0 ${theme.spacing.lg};
`;

const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #FF6B35 0%, #FF8E53 100%);
  border-radius: ${theme.borderRadius.full};
  width: ${props => props.progress}%;
`;

interface StreakBarProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakBar: React.FC<StreakBarProps> = ({ 
  currentStreak, 
  longestStreak 
}) => {
  const progressPercentage = longestStreak > 0 ? (currentStreak / longestStreak) * 100 : 0;

  return (
    <StreakContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <StreakInfo>
        <StreakIcon>🔥</StreakIcon>
        <StreakTitle>Streak</StreakTitle>
      </StreakInfo>
      
      <ProgressBar>
        <ProgressFill
          progress={progressPercentage}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </ProgressBar>
      
      <StreakStats>
        <StreakStat>
          <StreakNumber>{currentStreak}</StreakNumber>
          <StreakLabel>Current</StreakLabel>
        </StreakStat>
        <StreakStat>
          <StreakNumber>{longestStreak}</StreakNumber>
          <StreakLabel>Best</StreakLabel>
        </StreakStat>
      </StreakStats>
    </StreakContainer>
  );
};
