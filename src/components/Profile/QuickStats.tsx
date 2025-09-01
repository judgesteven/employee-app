import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import { theme } from '../../styles/theme';


const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const StatCard = styled(motion.div)`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${theme.spacing.sm};
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const StatIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => props.color}20;
  color: ${props => props.color};
  margin-bottom: ${theme.spacing.xs};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const StatChange = styled.div<{ positive: boolean }>`
  font-size: ${theme.typography.fontSize.xs};
  color: ${props => props.positive ? theme.colors.success : theme.colors.error};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-top: ${theme.spacing.xs};
`;

const RecentAchievements = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const AchievementsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const AchievementsTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const AchievementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const AchievementItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
`;

const AchievementIcon = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gradients.secondary};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.text.inverse};
`;

const AchievementInfo = styled.div`
  flex: 1;
`;

const AchievementName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const AchievementDate = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
`;

interface QuickStatsProps {
  dailySteps: number;
  weeklySteps: number;
  monthlySteps: number;
  recentAchievements: Array<{
    id: string;
    name: string;
    icon: string;
    unlockedAt: Date;
  }>;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  dailySteps,
  weeklySteps,
  monthlySteps,
  recentAchievements,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {(weeklySteps > 0 || monthlySteps > 0) && (
        <StatsGrid>
          {weeklySteps > 0 && (
            <StatCard variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <StatIcon color={theme.colors.primary}>
                <TrendingUp size={24} />
              </StatIcon>
              <StatValue>{formatNumber(weeklySteps)}</StatValue>
              <StatLabel>This Week</StatLabel>
              <StatChange positive={true}>+12% from last week</StatChange>
            </StatCard>
          )}

          {monthlySteps > 0 && (
            <StatCard variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <StatIcon color={theme.colors.secondary}>
                <Calendar size={24} />
              </StatIcon>
              <StatValue>{formatNumber(monthlySteps)}</StatValue>
              <StatLabel>This Month</StatLabel>
              <StatChange positive={true}>+8% from last month</StatChange>
            </StatCard>
          )}
        </StatsGrid>
      )}

      {recentAchievements.length > 0 && (
        <RecentAchievements>
          <AchievementsHeader>
            <Award color={theme.colors.accent} size={24} />
            <AchievementsTitle>Recent Achievements</AchievementsTitle>
          </AchievementsHeader>
          
          <AchievementsList>
            {recentAchievements.slice(0, 3).map((achievement) => (
              <AchievementItem
                key={achievement.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <AchievementIcon>{achievement.icon}</AchievementIcon>
                <AchievementInfo>
                  <AchievementName>{achievement.name}</AchievementName>
                  <AchievementDate>
                    Unlocked {formatDate(achievement.unlockedAt)}
                  </AchievementDate>
                </AchievementInfo>
              </AchievementItem>
            ))}
          </AchievementsList>
        </RecentAchievements>
      )}
    </motion.div>
  );
};
