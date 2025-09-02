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
  background: ${props => props.$bgColor || 'linear-gradient(135deg, #FFE4E1, #FFF0F5)'};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 160px;
  min-height: 200px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const AchievementStatusBadge = styled.div<{ $status: 'completed' | 'started' | 'locked' }>`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  padding: 2px ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: capitalize;
  
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

const AchievementBadgeContainer = styled.div`
  margin: ${theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
`;

const AchievementBadgeImage = styled.img`
  width: 140px;
  height: 140px;
  object-fit: contain;
`;

const AchievementIcon = styled.div`
  font-size: 100px;
  line-height: 1;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AchievementCategoryTag = styled.div`
  position: absolute;
  top: ${theme.spacing.xs};
  left: ${theme.spacing.xs};
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
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
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: 4px;
`;

const ProgressFill = styled.div<{ $progress: number; $status: 'completed' | 'started' | 'locked' }>`
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
  
  ${props => {
    switch (props.$status) {
      case 'completed':
        return `background: ${theme.colors.success};`;
      case 'started':
        return `background: ${theme.colors.primary};`;
      case 'locked':
        return `background: ${theme.colors.text.tertiary};`;
    }
  }}
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
  console.log('🏠 QuickStats: Received achievements:', recentAchievements);
  console.log('🏠 QuickStats: Total achievements count:', recentAchievements.length);
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
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
            {(() => {
              const filteredAchievements = recentAchievements
                .filter(achievement => achievement.status === 'started' || achievement.status === 'completed');
              
              console.log(`🎯 QuickStats: Showing ${Math.min(filteredAchievements.length, 6)} of ${filteredAchievements.length} active achievements`);
              
              return filteredAchievements.slice(0, 6);
            })().map((achievement) => {
              const progressPercentage = achievement.totalSteps 
                ? (achievement.currentProgress || 0) / achievement.totalSteps * 100 
                : achievement.status === 'completed' ? 100 : 0;

              return (
                <AchievementCard
                  key={achievement.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  $bgColor={achievement.backgroundColor}
                >
                  <AchievementStatusBadge $status={achievement.status}>
                    {achievement.status}
                  </AchievementStatusBadge>

                  <AchievementBadgeContainer>
                    {achievement.badgeImage ? (
                      <AchievementBadgeImage 
                        src={achievement.badgeImage} 
                        alt={achievement.title}
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          const iconElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (iconElement) iconElement.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <AchievementIcon style={{ display: achievement.badgeImage ? 'none' : 'block' }}>
                      {achievement.icon}
                    </AchievementIcon>
                    
                    {achievement.category && (
                      <AchievementCategoryTag>
                        {achievement.category}
                      </AchievementCategoryTag>
                    )}
                  </AchievementBadgeContainer>

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
                </AchievementCard>
              );
            })}
          </AchievementsList>
        </RecentAchievements>
      )}
    </motion.div>
  );
};
