import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Target, ChevronRight, Gem } from 'lucide-react';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { QuickStats } from '../components/Profile/QuickStats';


import { Container, Card, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { User, Challenge, Achievement } from '../types';
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
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  transition: all 0.3s ease;
`;

const HeroImageSection = styled.div`
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
`;

const HeroImage = styled.div<{ $bgImage?: string }>`
  width: 100%;
  height: 100%;
  background: ${props => props.$bgImage ? `url("${props.$bgImage}")` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const RewardsOverlay = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const RewardBadge = styled.div<{ $type: 'gems' | 'experience' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.text.inverse};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
`;



const TagsOverlay = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  left: ${theme.spacing.md};
  display: flex;
  gap: ${theme.spacing.xs};
`;

const TimeRemainingOverlay = styled.div`
  position: absolute;
  bottom: ${theme.spacing.md};
  right: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.text.inverse};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const CardContent = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.xs};
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



const ProgressSection = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${theme.colors.surfaceHover};
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

const ProgressPercentage = styled.div`
  text-align: right;
  margin-top: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
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
      case 'steps':
        return `
          background: ${theme.colors.success};
          color: ${theme.colors.text.inverse};
          border-color: ${theme.colors.success};
        `;
      case 'minutes':
        return `
          background: ${theme.colors.primary};
          color: ${theme.colors.text.inverse};
          border-color: ${theme.colors.primary};
        `;
      case 'daily':
        return `
          background: ${theme.colors.accent};
          color: ${theme.colors.text.inverse};
          border-color: ${theme.colors.accent};
        `;
      case 'weekly':
        return `
          background: ${theme.colors.primary};
          color: ${theme.colors.text.inverse};
          border-color: ${theme.colors.primary};
        `;
      case 'monthly':
        return `
          background: ${theme.colors.secondary};
          color: ${theme.colors.text.inverse};
          border-color: ${theme.colors.secondary};
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

// GameLayer Banner
const GameLayerBanner = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.inverse};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 1;
`;

const BannerTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin: 0 0 ${theme.spacing.xs} 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const BannerSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  opacity: 0.9;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [inProgressMissions, setInProgressMissions] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
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
        name: 'Dancing Queen',
        description: 'Way to channel your inner Swede!',
        icon: '👑',
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        category: 'POP MUSIC',
        status: 'completed' as const,
        currentProgress: 1,
        totalSteps: 1,
        backgroundColor: 'linear-gradient(135deg, #FFE4E1, #FFF0F5)',
        badgeImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&h=120&fit=crop'
      },
      {
        id: '2',
        name: 'Rocket Man',
        description: 'You rock!',
        icon: '🚀',
        unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        category: 'POP MUSIC',
        status: 'completed' as const,
        currentProgress: 1,
        totalSteps: 1,
        backgroundColor: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
        badgeImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=120&h=120&fit=crop'
      },
      {
        id: '3',
        name: 'King Of Pop',
        description: 'That was a Thriller of an effort, congratulations!',
        icon: '🎤',
        unlockedAt: undefined, // Not unlocked yet
        category: 'POP MUSIC',
        status: 'started' as const,
        currentProgress: 3,
        totalSteps: 10,
        backgroundColor: 'linear-gradient(135deg, #F0F8FF, #E6E6FA)',
        badgeImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop'
      },
      {
        id: '4',
        name: 'Step Streak',
        description: 'Complete 5 days of step goals',
        icon: '🔥',
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        category: 'STREAKS',
        status: 'completed' as const,
        currentProgress: 5,
        totalSteps: 5,
        backgroundColor: 'linear-gradient(135deg, #FFE4E1, #FFCCCB)',
        badgeImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=120&h=120&fit=crop'
      },
      {
        id: '5',
        name: 'Weekend Warrior',
        description: 'Stay active on weekends',
        icon: '⚡',
        unlockedAt: undefined,
        category: 'FITNESS',
        status: 'started' as const,
        currentProgress: 2,
        totalSteps: 4,
        backgroundColor: 'linear-gradient(135deg, #E0FFFF, #F0FFFF)',
        badgeImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop'
      },
      {
        id: '6',
        name: 'Social Butterfly',
        description: 'Share achievements with friends',
        icon: '🦋',
        unlockedAt: undefined,
        category: 'SOCIAL',
        status: 'locked' as const,
        currentProgress: 0,
        totalSteps: 3,
        backgroundColor: 'linear-gradient(135deg, #F5F5DC, #FFF8DC)',
        badgeImage: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=120&h=120&fit=crop'
      },
    ],
  };



  useEffect(() => {
    const initializeHome = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get player data from GameLayer API
        const gameLayerPlayer = await gameLayerApi.getPlayer();
        
        // Get current step count from health service
        const currentSteps = await healthDataService.getCurrentStepCount();
        
        // Get achievements from GameLayer API
        const apiAchievements = await gameLayerApi.getAchievements();
        console.log('Home: Fetched achievements from GameLayer API:', apiAchievements);
        
        // Use API achievements if available, otherwise fall back to mock data
        const finalAchievements = apiAchievements.length > 0 ? apiAchievements : mockUser.achievements;
        
        // Update user data with real GameLayer name, avatar, and step count
        const updatedUser = {
          ...mockUser,
          name: gameLayerPlayer.name, // Use name from GameLayer API
          avatar: gameLayerPlayer.imgUrl || mockUser.avatar, // Use avatar from GameLayer API or fallback to mock
          dailyStepCount: currentSteps,
          achievements: finalAchievements,
        };
        
        setAchievements(finalAchievements);

        // Get missions from GameLayer API
        let missions = await gameLayerApi.getMissions();
        console.log('Home: Fetched missions from GameLayer API:', missions);
        console.log('Home: Number of missions fetched:', missions?.length || 0);
        
        // Filter incomplete missions and sort by priority (priority 1 is highest)
        missions = missions
          .filter(mission => !mission.completed)
          .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        
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
        // Set fallback data without missions
        const currentSteps = await healthDataService.getCurrentStepCount();
        const fallbackUser = {
          ...mockUser,
          dailyStepCount: currentSteps,
        };
        
        setUser(fallbackUser);
        setInProgressMissions([]); // Fallback to mock data
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
        
        <GameLayerBanner
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <BannerContent>
            <BannerTitle>Step-Up with GameLayer</BannerTitle>
            <BannerSubtitle>Transform your daily steps into achievements and rewards</BannerSubtitle>
          </BannerContent>
        </GameLayerBanner>
        
        <QuickStats
          dailySteps={user.dailyStepCount}
          weeklySteps={0} // Moved to profile details
          monthlySteps={0} // Moved to profile details
          recentAchievements={achievements}
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
                  <HeroImageSection>
                    <HeroImage $bgImage={mission.imgUrl}>
                      <RewardsOverlay>
                        <RewardBadge $type="gems">
                          <Gem size={16} />
                          {mission.reward}
                        </RewardBadge>
                      </RewardsOverlay>
                      <TagsOverlay>
                        <TagBadge $tag={mission.type}>
                          {mission.type}
                        </TagBadge>
                        {mission.tags && mission.tags.slice(0, 2).map((tag, index) => (
                          <TagBadge key={index} $tag={tag}>
                            {tag}
                          </TagBadge>
                        ))}
                      </TagsOverlay>
                      <TimeRemainingOverlay>
                        <Clock size={14} />
                        {formatTimeLeft(mission.expiresAt)}
                      </TimeRemainingOverlay>
                    </HeroImage>
                  </HeroImageSection>
                  
                  <CardContent>
                    <MissionHeader>
                    <MissionInfo>
                      <MissionTitleContainer>
                        <MissionTitle>{mission.title}</MissionTitle>
                      </MissionTitleContainer>
                      <MissionDescription>{mission.description}</MissionDescription>
                    </MissionInfo>
                  </MissionHeader>

                  <ProgressSection>
                    {mission.objectives && mission.objectives.length > 1 ? (
                      // Multiple objectives - show each one
                      mission.objectives.map((objective, index) => (
                        <div key={objective.id} style={{ marginBottom: index < mission.objectives!.length - 1 ? '16px' : '0' }}>
                          <ProgressText>
                            <ProgressCurrent>
                              {objective.currentProgress.toLocaleString()} / {objective.targetValue.toLocaleString()}
                            </ProgressCurrent>
                          </ProgressText>
                          <ProgressBar>
                            <ProgressFill
                              $progress={getProgressPercentage(objective.currentProgress, objective.targetValue)}
                            />
                          </ProgressBar>
                          <ProgressPercentage>
                            {Math.round(getProgressPercentage(objective.currentProgress, objective.targetValue))}% complete
                          </ProgressPercentage>
                        </div>
                      ))
                    ) : (
                      // Single objective - show normal progress
                      <>
                        <ProgressText>
                          <ProgressCurrent>
                            {mission.currentProgress.toLocaleString()} / {mission.targetValue.toLocaleString()}
                          </ProgressCurrent>
                        </ProgressText>
                        <ProgressBar>
                          <ProgressFill
                            $progress={getProgressPercentage(mission.currentProgress, mission.targetValue)}
                          />
                        </ProgressBar>
                        <ProgressPercentage>
                          {Math.round(getProgressPercentage(mission.currentProgress, mission.targetValue))}% complete
                        </ProgressPercentage>
                      </>
                    )}
                  </ProgressSection>


                  </CardContent>
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

