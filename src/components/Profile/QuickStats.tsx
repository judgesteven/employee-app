import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Achievement } from '../../types';


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
  gap: ${theme.spacing.md};
  overflow-x: auto;
  padding-bottom: ${theme.spacing.sm};
  scroll-behavior: smooth;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const AchievementCard = styled(motion.div)<{ $bgColor?: string }>`
  background: ${props => props.$bgColor || theme.colors.background};
  border-radius: ${theme.borderRadius.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 160px;
  min-height: 200px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  transition: all 0.3s ease;
`;

const AchievementStatusBadge = styled.div<{ $status: 'completed' | 'started' | 'locked' }>`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: lowercase;
  
  ${props => {
    switch (props.$status) {
      case 'completed':
        return `
          background: ${theme.colors.success};
          color: white;
        `;
      case 'started':
        return `
          background: ${theme.colors.primary};
          color: white;
        `;
      case 'locked':
        return `
          background: ${theme.colors.text.tertiary};
          color: white;
        `;
    }
  }}
`;

const AchievementImageSection = styled.div<{ $bgImage?: string; $status: 'completed' | 'started' | 'locked' }>`
  position: relative;
  height: 120px;
  width: 100%;
  background: ${props => props.$bgImage ? `url("${props.$bgImage}")` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  overflow: hidden;
  opacity: ${props => {
    switch (props.$status) {
      case 'completed':
        return '1';
      case 'started':
        return '0.5';
      case 'locked':
        return '0.3';
      default:
        return '1';
    }
  }};
`;

const AchievementIcon = styled.div`
  font-size: 80px;
  line-height: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AchievementContent = styled.div`
  padding: ${theme.spacing.md};
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AchievementCategoryTag = styled.div`
  position: absolute;
  top: calc(120px - ${theme.spacing.md} - 20px); /* Position slightly higher in image section */
  left: ${theme.spacing.sm};
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: lowercase;
  letter-spacing: 0.3px;
  backdrop-filter: blur(4px);
  z-index: 2;
`;

const AchievementInfo = styled.div`
  width: 100%;
`;

const AchievementName = styled.h3`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: ${theme.spacing.xs} 0;
  line-height: 1.2;
`;

const AchievementDescription = styled.p`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.sm};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AchievementProgress = styled.div`
  width: 100%;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.surfaceHover};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: 4px;
`;

const ProgressFill = styled.div<{ $progress: number; $status: 'completed' | 'started' | 'locked' }>`
  height: 100%;
  background: ${theme.colors.gradients.success};
  border-radius: ${theme.borderRadius.full};
  transition: width 0.3s ease-in-out;
  width: ${props => props.$progress}%;
`;

const ProgressText = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

interface QuickStatsProps {
  dailySteps: number;
  weeklySteps: number;
  monthlySteps: number;
  recentAchievements: Achievement[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  dailySteps,
  weeklySteps,
  monthlySteps,
  recentAchievements,
}) => {

  const formatNumber = (num: number): string => 
    num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` :
    num >= 1000 ? `${(num / 1000).toFixed(1)}k` : 
    num.toLocaleString();



  const variants = {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    }
  };

  return (
    <motion.div
      variants={variants.container}
      initial="hidden"
      animate="visible"
    >
      {(weeklySteps > 0 || monthlySteps > 0) && (
        <StatsGrid>
          {weeklySteps > 0 && (
            <StatCard variants={variants.item} whileHover={{ scale: 1.02 }}>
              <StatIcon color={theme.colors.primary}>
                <TrendingUp size={24} />
              </StatIcon>
              <StatValue>{formatNumber(weeklySteps)}</StatValue>
              <StatLabel>This Week</StatLabel>
              <StatChange positive={true}>+12% from last week</StatChange>
            </StatCard>
          )}

          {monthlySteps > 0 && (
            <StatCard variants={variants.item} whileHover={{ scale: 1.02 }}>
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
            {recentAchievements
              .filter(achievement => achievement.status !== 'locked')
              .slice(0, 6)
              .map((achievement) => {
              const progressPercentage = achievement.totalSteps 
                ? (achievement.currentProgress || 0) / achievement.totalSteps * 100 
                : achievement.status === 'completed' ? 100 : 0;

              return (
                <AchievementCard
                  key={achievement.id}
                  variants={variants.item}
                  whileHover={{ scale: 1.02 }}
                  $bgColor={achievement.backgroundColor}
                >
                  <AchievementImageSection $bgImage={achievement.badgeImage} $status={achievement.status}>
                    {!achievement.badgeImage && (
                      <AchievementIcon>
                        {achievement.icon}
                      </AchievementIcon>
                    )}
                  </AchievementImageSection>

                  <AchievementStatusBadge $status={achievement.status}>
                    {achievement.status}
                  </AchievementStatusBadge>

                  {achievement.category && (
                    <AchievementCategoryTag>
                      {achievement.category}
                    </AchievementCategoryTag>
                  )}

                  <AchievementContent>
                    <AchievementInfo>
                    <AchievementName>{achievement.title}</AchievementName>
                    <AchievementDescription>{achievement.description}</AchievementDescription>
                    
                    <AchievementProgress>
                      <ProgressBar>
                        <ProgressFill 
                          $progress={progressPercentage} 
                          $status={achievement.status}
                        />
                      </ProgressBar>
                      <ProgressText>
                        {achievement.status === 'completed' 
                          ? 'Completed!' 
                          : achievement.totalSteps 
                            ? `${achievement.currentProgress || 0} / ${achievement.totalSteps}`
                            : 'In Progress'
                        }
                      </ProgressText>
                    </AchievementProgress>
                  </AchievementInfo>
                  </AchievementContent>
                </AchievementCard>
              );
            })}
          </AchievementsList>
        </RecentAchievements>
      )}
    </motion.div>
  );
};
