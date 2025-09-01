import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Target, ChevronRight, Gem } from 'lucide-react';
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

const MissionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xs};
`;

const MissionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
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

const MissionImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  object-fit: cover;
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
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const ProgressTarget = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const MissionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RewardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.accent};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const TimeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const MissionType = styled.div<{ type: string }>`
  display: inline-block;
  width: fit-content;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: lowercase;
  border: 1px solid;
  
  ${props => {
    switch (props.type) {
      case 'daily':
        return `
          background: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
          border-color: ${theme.colors.accent}40;
        `;
      case 'weekly':
        return `
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary}40;
        `;
      case 'monthly':
        return `
          background: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
          border-color: ${theme.colors.secondary}40;
        `;
      default:
        return `
          background: ${theme.colors.surface};
          color: ${theme.colors.text.secondary};
          border-color: ${theme.colors.border};
        `;
    }
  }}
`;

const TagsAndCategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.sm};
`;

const TagBadge = styled.div<{ $tag: string }>`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: lowercase;
  border: 1px solid;
  
  ${props => {
    const tag = props.$tag.toLowerCase();
    switch (tag) {
      case 'fitness':
      case 'cardio':
      case 'workout':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
          border-color: ${theme.colors.success}40;
        `;
      case 'activity':
      case 'movement':
      case 'active':
        return `
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary}40;
        `;
      case 'endurance':
      case 'marathon':
      case 'challenge':
        return `
          background: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
          border-color: ${theme.colors.accent}40;
        `;
      case 'habit':
      case 'streak':
      case 'consistency':
        return `
          background: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
          border-color: ${theme.colors.secondary}40;
        `;
      case 'evening':
      case 'morning':
      case 'time':
        return `
          background: #8B5CF6;
          color: #8B5CF6;
          border-color: #8B5CF640;
        `;
      case 'weekend':
      case 'weekly':
      case 'daily':
        return `
          background: #F59E0B20;
          color: #F59E0B;
          border-color: #F59E0B40;
        `;
      case 'relaxation':
      case 'calm':
      case 'wellness':
        return `
          background: #10B98120;
          color: #10B981;
          border-color: #10B98140;
        `;
      case 'intensive':
      case 'power':
      case 'strength':
        return `
          background: #EF444420;
          color: #EF4444;
          border-color: #EF444440;
        `;
      case 'long-term':
      case 'goal':
      case 'target':
        return `
          background: #6366F120;
          color: #6366F1;
          border-color: #6366F140;
        `;
      default:
        return `
          background: ${theme.colors.surface};
          color: ${theme.colors.text.secondary};
          border-color: ${theme.colors.border};
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
      tags: ['fitness', 'cardio'],
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
      tags: ['endurance', 'challenge'],
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
      tags: ['habit', 'streak'],
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

        // Get missions from GameLayer API
        let missions = await gameLayerApi.getMissions();
        console.log('Home: Fetched missions from GameLayer API:', missions);
        console.log('Home: Number of missions fetched:', missions?.length || 0);
        
        // If no missions from API, use mock data as fallback
        if (!missions || missions.length === 0) {
          console.log('Home: No missions from API, using mock data');
          missions = mockInProgressMissions;
        }
        
        // Log mission data (removed step override logic)
        const updatedMissions = missions.map(mission => {
          console.log('Home: Processing mission:', mission.title);
          console.log('Home: Mission progress from API:', mission.currentProgress, '/', mission.targetValue);
          console.log('Home: Mission tags:', mission.tags);
          
          // Use the progress data directly from GameLayer API
          return mission;
        });

        console.log('Home: Updated missions:', updatedMissions.length);

        // Only filter out truly invalid missions - be more permissive
        const filteredMissions = updatedMissions.filter(mission => {
          // Only remove missions that are clearly invalid or incomplete
          // Don't filter based on 0/1 as this might be valid for some mission types
          if (!mission.id || !mission.title) {
            console.log('Home: Filtering out invalid mission:', mission);
            return false;
          }
          return true;
        });

        console.log('Home: Filtered missions:', filteredMissions.length);
        console.log('Home: Final missions to display:', filteredMissions.slice(0, 3));

        setUser(updatedUser);
        setInProgressMissions(filteredMissions.slice(0, 3)); // Show only first 3 missions on home
      } catch (err) {
        console.error('Error initializing home:', err);
        setError('Failed to load data. Please try again.');
        // Fallback to mock data if GameLayer API fails
        const currentSteps = await healthDataService.getCurrentStepCount();
        const fallbackUser = {
          ...mockUser,
          dailyStepCount: currentSteps,
        };
        
        // Apply same filtering to mock data
        const filteredMockMissions = mockInProgressMissions.filter(mission => {
          // Only remove missions that are clearly invalid or incomplete
          if (!mission.id || !mission.title) {
            console.log('Home: Filtering out invalid fallback mission:', mission);
            return false;
          }
          return true;
        });
        
        setUser(fallbackUser);
        setInProgressMissions(filteredMockMissions.slice(0, 3)); // Fallback to mock data
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
    
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    
    // Format as DD:HH:MM with conditional display
    if (days > 0) {
      // Show DD:HH:MM
      return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else if (hours > 0) {
      // Show HH:MM (no days)
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      // Show MM (no days or hours)
      return `${minutes.toString().padStart(2, '0')}`;
    }
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
                      <MissionTitleContainer>
                        <MissionTitle>{mission.title}</MissionTitle>
                      </MissionTitleContainer>
                      <MissionDescription>{mission.description}</MissionDescription>
                      <TagsAndCategoryContainer>
                        <MissionType type={mission.type}>
                          {mission.type}
                        </MissionType>
                        {mission.tags && mission.tags.length > 0 && (
                          <>
                            {mission.tags.map((tag, index) => (
                              <TagBadge key={index} $tag={tag}>
                                {tag}
                              </TagBadge>
                            ))}
                          </>
                        )}
                      </TagsAndCategoryContainer>
                    </MissionInfo>
                    {mission.imgUrl ? (
                      <MissionImage src={mission.imgUrl} alt={mission.title} />
                    ) : (
                      <MissionIcon>{mission.icon}</MissionIcon>
                    )}
                  </MissionHeader>

                  <ProgressSection>
                    <ProgressText>
                      <ProgressCurrent>
                        {mission.currentProgress.toLocaleString()} / {mission.targetValue.toLocaleString()}
                      </ProgressCurrent>
                      <ProgressTarget>
                        {Math.round(getProgressPercentage(mission.currentProgress, mission.targetValue))}% complete
                      </ProgressTarget>
                    </ProgressText>
                    <ProgressBar>
                      <ProgressFill
                        $progress={getProgressPercentage(mission.currentProgress, mission.targetValue)}
                      />
                    </ProgressBar>
                  </ProgressSection>

                  <MissionFooter>
                    <RewardInfo>
                      <Gem size={16} />
                      <span>{mission.reward} gems</span>
                    </RewardInfo>
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

