import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Target, ChevronRight } from 'lucide-react';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { QuickStats } from '../components/Profile/QuickStats';


import { Container, Card, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { User, Challenge } from '../types';
import { healthDataService } from '../services/healthData';
import { gameLayerApi } from '../services/gameLayerApi';

const HomeContainer = styled(Container)`
  padding-top: ${theme.spacing.lg};
  padding-bottom: calc(80px + ${theme.spacing.lg});
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.border};
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.base};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const SectionTitleText = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const ViewAllButton = styled(Button)`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
`;

const MissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const MissionCard = styled(motion.div)`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const MissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const MissionInfo = styled.div`
  flex: 1;
`;

const MissionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const MissionDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  margin-bottom: ${theme.spacing.sm};
`;

const MissionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.xl};
  margin-left: ${theme.spacing.md};
`;

const ProgressSection = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${theme.spacing.sm};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => Math.min(props.$progress, 100)}%;
  height: 100%;
  background: ${theme.colors.gradients.success};
  border-radius: ${theme.borderRadius.full};
  transition: width 0.3s ease-in-out;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${theme.typography.fontSize.sm};
`;

const ProgressCurrent = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const ProgressTarget = styled.span`
  color: ${theme.colors.text.secondary};
`;

const MissionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TimeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const MissionType = styled.div<{ type: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  
  ${props => {
    switch (props.type) {
      case 'daily':
        return `
          background: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
        `;
      case 'weekly':
        return `
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'monthly':
        return `
          background: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
        `;
      default:
        return `
          background: ${theme.colors.surface};
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const EmptyState = styled(Card)`
  text-align: center;
  padding: ${theme.spacing.xl};
`;

const EmptyStateIcon = styled.div`
  font-size: ${theme.typography.fontSize['4xl']};
  margin-bottom: ${theme.spacing.md};
`;

const EmptyStateText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.base};
  margin-bottom: ${theme.spacing.md};
`;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [inProgressMissions, setInProgressMissions] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user data
  const mockUser: User = {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 12,
    team: 'Marketing Team',
    dailyStepCount: 0,
    allTimeStepCount: 2847392,
    dailyActiveMinutes: 78,
    allTimeActiveMinutes: 156420,
    gems: 1247,
    achievements: [
      {
        id: '1',
        name: 'Early Bird',
        description: 'Complete a morning challenge',
        icon: '🌅',
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        name: 'Step Master',
        description: 'Reach 10,000 steps in a day',
        icon: '👟',
        unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        name: 'Consistency King',
        description: 'Complete challenges for 7 days straight',
        icon: '👑',
        unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  };

  // Mock in-progress missions
  const mockInProgressMissions: Challenge[] = [
    {
      id: '1',
      title: 'Step Sprint',
      description: 'Take 8,000 steps today',
      type: 'daily',
      targetValue: 8000,
      currentProgress: 5243,
      reward: 50,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
      completed: false,
      icon: '🏃‍♂️',
    },
    {
      id: '3',
      title: 'Weekly Warrior',
      description: 'Accumulate 50,000 steps this week',
      type: 'weekly',
      targetValue: 50000,
      currentProgress: 32450,
      reward: 200,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      completed: false,
      icon: '⚡',
    },
    {
      id: '4',
      title: 'Consistency Champion',
      description: 'Complete daily challenges for 7 days straight',
      type: 'weekly',
      targetValue: 7,
      currentProgress: 4,
      reward: 150,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      completed: false,
      icon: '🏆',
    },
  ];

  useEffect(() => {
    const initializeHome = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get player data from GameLayer API
        const gameLayerPlayer = await gameLayerApi.getPlayer();
        
        // Get current step count from health service
        const currentSteps = await healthDataService.getCurrentStepCount();
        
        // Update user data with real GameLayer name and step count
        const updatedUser = {
          ...mockUser,
          name: gameLayerPlayer.name, // Use name from GameLayer API
          dailyStepCount: currentSteps,
        };

        // Update mission progress based on current steps
        const updatedMissions = mockInProgressMissions.map(mission => {
          if (mission.type === 'daily' && mission.title.includes('steps')) {
            return {
              ...mission,
              currentProgress: Math.min(currentSteps, mission.targetValue),
            };
          }
          return mission;
        });

        setUser(updatedUser);
        setInProgressMissions(updatedMissions);
      } catch (err) {
        console.error('Error initializing home:', err);
        setError('Failed to load data. Please try again.');
        // Fallback to mock data if GameLayer API fails
        const currentSteps = await healthDataService.getCurrentStepCount();
        const fallbackUser = {
          ...mockUser,
          dailyStepCount: currentSteps,
        };
        setUser(fallbackUser);
        setInProgressMissions(mockInProgressMissions);
      } finally {
        setLoading(false);
      }
    };

    initializeHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mockUser and mockInProgressMissions are static data

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewAllMissions = () => {
    navigate('/challenges');
  };

  const formatTimeLeft = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h left`;
    if (hours > 0) return `${hours}h left`;
    
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes}m left`;
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return (current / target) * 100;
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

  if (loading) {
    return (
      <HomeContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading your dashboard...</LoadingText>
        </LoadingContainer>
      </HomeContainer>
    );
  }

  if (!user) {
    return (
      <HomeContainer>
        <div>No user data available</div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ProfileHeader user={user} onViewMore={handleViewProfile} />
        
        <QuickStats
          dailySteps={user.dailyStepCount}
          weeklySteps={0} // Moved to profile details
          monthlySteps={0} // Moved to profile details
          recentAchievements={user.achievements.filter(a => a.unlockedAt) as Array<{
            id: string;
            name: string;
            icon: string;
            unlockedAt: Date;
          }>}
        />

        <Section>
          <SectionHeader>
            <SectionTitle>
              <Target color={theme.colors.primary} size={24} />
              <SectionTitleText>Active Missions</SectionTitleText>
            </SectionTitle>
            <ViewAllButton
              variant="ghost"
              size="sm"
              onClick={handleViewAllMissions}
            >
              View All
              <ChevronRight size={16} />
            </ViewAllButton>
          </SectionHeader>

          {inProgressMissions.length > 0 ? (
            <MissionsList>
              {inProgressMissions.slice(0, 3).map((mission) => (
                <MissionCard
                  key={mission.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MissionHeader>
                    <MissionInfo>
                      <MissionTitle>{mission.title}</MissionTitle>
                      <MissionDescription>{mission.description}</MissionDescription>
                    </MissionInfo>
                    <MissionIcon>{mission.icon}</MissionIcon>
                  </MissionHeader>

                  <ProgressSection>
                    <ProgressBar>
                      <ProgressFill
                        $progress={getProgressPercentage(mission.currentProgress, mission.targetValue)}
                      />
                    </ProgressBar>
                    <ProgressText>
                      <ProgressCurrent>
                        {mission.currentProgress.toLocaleString()} / {mission.targetValue.toLocaleString()}
                      </ProgressCurrent>
                      <ProgressTarget>
                        {Math.round(getProgressPercentage(mission.currentProgress, mission.targetValue))}%
                      </ProgressTarget>
                    </ProgressText>
                  </ProgressSection>

                  <MissionFooter>
                    <MissionType type={mission.type}>
                      {mission.type}
                    </MissionType>
                    <TimeLeft>
                      <Clock size={16} />
                      <span>{formatTimeLeft(mission.expiresAt)}</span>
                    </TimeLeft>
                  </MissionFooter>
                </MissionCard>
              ))}
            </MissionsList>
          ) : (
            <EmptyState>
              <EmptyStateIcon>🎯</EmptyStateIcon>
              <EmptyStateText>No active missions right now</EmptyStateText>
              <ViewAllButton
                variant="primary"
                onClick={handleViewAllMissions}
              >
                Browse Missions
              </ViewAllButton>
            </EmptyState>
          )}
        </Section>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: theme.colors.warning + '20',
              border: `1px solid ${theme.colors.warning}`,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              marginTop: theme.spacing.md,
            }}
          >
            <p style={{ color: theme.colors.warning, margin: 0, fontSize: theme.typography.fontSize.sm }}>
              ⚠️ Health data may not be up to date: {error}
            </p>
          </motion.div>
        )}
      </motion.div>
    </HomeContainer>
  );
};
