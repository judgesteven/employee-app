import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gem, Flame } from 'lucide-react';
import { theme } from '../../styles/theme';

const StreakContainer = styled(motion.div)`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  transition: all 0.3s ease;
`;

const StreakIcon = styled.div<{ $intensity: number }>`
  display: flex;
  align-items: center;
  color: ${props => {
    if (props.$intensity >= 30) return '#FF4500'; // Deep orange for high streaks
    if (props.$intensity >= 14) return '#FF6B35'; // Orange for good streaks
    if (props.$intensity >= 7) return '#FF8E53';  // Light orange for starting streaks
    if (props.$intensity >= 1) return '#FFA500';  // Yellow-orange for new streaks
    return theme.colors.text.tertiary; // Gray for no streak
  }};
  filter: ${props => {
    if (props.$intensity >= 30) return 'drop-shadow(0 0 6px #FF4500)';
    if (props.$intensity >= 14) return 'drop-shadow(0 0 4px #FF6B35)';
    if (props.$intensity >= 7) return 'drop-shadow(0 0 2px #FF8E53)';
    return 'none';
  }};
  flex-shrink: 0;
`;

const StreakLabel = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  flex-shrink: 0;
`;

const StreakValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  flex-shrink: 0;
  min-width: 40px;
  text-align: center;
`;

const ProgressSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  min-width: 0; /* Allow flex shrinking */
`;

const SegmentedProgressBar = styled.div`
  flex: 1;
  display: flex;
  gap: 2px;
  align-items: center;
  min-width: 100px; /* Minimum width to show segments */
`;

const ProgressSegment = styled(motion.div)<{ $active: boolean }>`
  flex: 1;
  height: 6px;
  background: ${props => props.$active ? 
    'linear-gradient(90deg, #FF6B35 0%, #FF8E53 100%)' : 
    theme.colors.border
  };
  border-radius: ${theme.borderRadius.full};
  transition: background 0.3s ease;
`;

const RewardGem = styled.div<{ $reached: boolean }>`
  color: ${props => props.$reached ? '#6366F1' : theme.colors.text.tertiary};
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  flex-shrink: 0;
`;

const CelebrationMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing.sm};
  border: 1px solid rgba(34, 197, 94, 0.2);
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const CelebrationGem = styled.div`
  color: #6366F1;
  display: flex;
  align-items: center;
`;

interface StreakBarProps {
  currentStreak: number;
}

export const StreakBar: React.FC<StreakBarProps> = ({ currentStreak }) => {
  const getIconSize = (streak: number) => {
    if (streak >= 30) return 24;
    if (streak >= 14) return 22;
    if (streak >= 7) return 20;
    if (streak >= 1) return 18;
    return 16;
  };

  // Focus on 10-day milestone with gem reward
  const targetMilestone = 10;
  const isGoalReached = currentStreak >= targetMilestone;

  return (
    <>
      <StreakContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
      >
        <StreakIcon $intensity={currentStreak}>
          <Flame size={getIconSize(currentStreak)} />
        </StreakIcon>
        
        <StreakLabel>Streak Bonus</StreakLabel>
        
        <StreakValue>{currentStreak}</StreakValue>
        
        <ProgressSection>
          <SegmentedProgressBar>
            {Array.from({ length: 10 }, (_, i) => (
              <ProgressSegment
                key={i}
                $active={i < currentStreak}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: i < currentStreak ? 1 : 0.8,
                  opacity: i < currentStreak ? 1 : 0.5
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: i * 0.02,
                  ease: "easeOut"
                }}
              />
            ))}
          </SegmentedProgressBar>
          
          <RewardGem $reached={isGoalReached}>
            <Gem size={20} />
          </RewardGem>
        </ProgressSection>
      </StreakContainer>

      {isGoalReached && (
        <CelebrationMessage>
          <CelebrationGem>
            <Gem size={20} />
          </CelebrationGem>
          🎉 Goal achieved! You've earned your gem reward!
        </CelebrationMessage>
      )}
    </>
  );
};