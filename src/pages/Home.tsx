import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Target, Gem } from 'lucide-react';
import gameLayerLogo from '../assets/gamelayer-logo.png';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { QuickStats } from '../components/Profile/QuickStats';

import { StreakBar } from '../components/Profile/StreakBar';
import { Rankings } from '../components/Rankings/Rankings';
import { TodaysRewards } from '../components/Rewards/TodaysRewards';


import { Container, Card, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { User, Challenge, Achievement } from '../types';
import { gameLayerApi } from '../services/gameLayerApi';
import { playerDataPollingService } from '../services/playerDataPollingService';

const HomeContainer = styled(Container)`
  padding-top: ${theme.spacing.lg};
  padding-bottom: calc(80px + ${theme.spacing.lg});
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 1) 100%);
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

const MissionsContainer = styled(motion.div)`
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

const MissionsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const MissionsTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const MissionsIcon = styled.div`
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
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

const PoweredByContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: ${theme.spacing.lg};
`;

const PoweredByLogo = styled.img`
  width: 16px;
  height: 16px;
  opacity: 0.8;
`;



const PoweredByText = styled.div`
  color: ${theme.colors.text.tertiary};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;



export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [featuredMissions, setFeaturedMissions] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback user data for when API fails
  const fallbackUser: User = {
    id: '1',
    name: 'Player',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 1,
    team: 'Team',
    dailyStepCount: 0,
    allTimeStepCount: 0,
    dailyActiveMinutes: 0,
    allTimeActiveMinutes: 0,
    gems: 0,
    xp: 0,
    achievements: [],
    currentStreak: 8, // Mock streak data set to 8
    longestStreak: 23,
  };



  useEffect(() => {
    const initializeHome = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get player data from GameLayer API
        const gameLayerPlayer = await gameLayerApi.getPlayer();
        
        // Get team name if team ID is available
        let teamName = fallbackUser.team;
        if (gameLayerPlayer.team) {
          try {
            const teamData = await gameLayerApi.getTeam(gameLayerPlayer.team);
            teamName = teamData.team?.name || gameLayerPlayer.team; // Use team name from nested structure or fallback to team ID
          } catch (error) {
            teamName = gameLayerPlayer.team; // Fallback to team ID if API call fails
          }
        }
        
        // Get achievements from GameLayer API
        const apiAchievements = await gameLayerApi.getAchievements();

        
        // Use API achievements only
        const finalAchievements = apiAchievements;
        
        // Get step count from daily-step-tracker mission
        let stepCountFromMission = 0;
        try {
          const dailyStepMission = await gameLayerApi.getPlayerMission(undefined, 'daily-step-tracker');
          stepCountFromMission = dailyStepMission?.objectives?.events?.count ?? 0;
        } catch (error) {
          // Fallback to points from API if mission call fails
          stepCountFromMission = gameLayerPlayer.points ?? 0;
        }

        // Update user data with real GameLayer API data
        const creditsFromAPI = gameLayerPlayer.credits ?? 0;
        
        
        const updatedUser = {
          ...fallbackUser,
          name: gameLayerPlayer.name || fallbackUser.name, // Use name from GameLayer API
          avatar: gameLayerPlayer.imgUrl || fallbackUser.avatar, // Use avatar from GameLayer API or fallback
          level: gameLayerPlayer.level?.number || fallbackUser.level, // Use level number from GameLayer API
          levelName: gameLayerPlayer.level?.name, // Use level name from GameLayer API
          team: teamName, // Use resolved team name
          gems: creditsFromAPI, // Use credits from GameLayer API, default to 0 if not available
          dailyStepCount: stepCountFromMission, // Use step count from daily-step-tracker mission
          achievements: finalAchievements,
          currentStreak: 8, // Use mock streak data
          longestStreak: 23, // Use mock streak data
        };
        
        
        setAchievements(finalAchievements);

        // Get player missions with progress data from single endpoint
        const playerMissionsResponse = await gameLayerApi.getPlayerMissionProgress();
        const missions = await gameLayerApi.getMissions();
        
        // Filter for Priority 1 missions, exclude Hidden category, and merge with progress
        const updatedMissions = missions
          .filter(mission => 
            !mission.completed && 
            mission.priority === 1 && 
            mission.category?.toLowerCase() !== 'hidden'
          )
          .map(mission => {
            const progress = playerMissionsResponse[mission.id];
            return progress ? { ...mission, ...progress } : mission;
          })
          .sort((a, b) => (a.priority || 999) - (b.priority || 999));



        // Only filter out truly invalid missions - be more permissive
        const filteredMissions = updatedMissions.filter(mission => {
          // Only remove missions that are clearly invalid or incomplete
          // Don't filter based on 0/1 as this might be valid for some mission types
          if (!mission.id || !mission.title) {

            return false;
          }
          return true;
        });



        setUser(updatedUser);
        setFeaturedMissions(filteredMissions.slice(0, 3)); // Show only first 3 featured missions on home
        
        // Set up player data polling to keep UI updated
        const handlePlayerDataUpdate = (playerData: any) => {
          console.log('🔄 Updating user data from GameLayer polling...');
          setUser(prevUser => {
            if (!prevUser) return prevUser;
            
            // Update user with fresh data from GameLayer
            return {
              ...prevUser,
              gems: playerData.credits || prevUser.gems,
              dailyStepCount: playerData.dailyStepCount || prevUser.dailyStepCount,
            };
          });
        };

        // Start polling for player data updates
        playerDataPollingService.addListener(handlePlayerDataUpdate);
        
        // Set up mission progress polling
        const handleMissionUpdate = (missions: any[]) => {
          console.log('🎯 Updating missions from GameLayer polling...');
          
          // Filter for Priority 1 missions, exclude Hidden category
          const updatedMissions = missions
            .filter(mission => 
              !mission.completed && 
              mission.priority === 1 && 
              mission.category?.toLowerCase() !== 'hidden'
            )
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));

          setFeaturedMissions(updatedMissions.slice(0, 3));
        };
        
        // Set up reward polling for TodaysRewards component
        const handleRewardUpdate = (rewards: any[]) => {
          console.log('🏆 Updating rewards from GameLayer polling on Home...');
          // Rewards will be handled by TodaysRewards component via event system
          const event = new CustomEvent('rewardsUpdated', { detail: rewards });
          window.dispatchEvent(event);
        };
        
        playerDataPollingService.addMissionListener(handleMissionUpdate);
        playerDataPollingService.addRewardListener(handleRewardUpdate);
        playerDataPollingService.startPolling(gameLayerPlayer.id);
        
      } catch (err) {
        console.error('Error initializing home:', err);
        setError('Failed to load data. Please try again.');
        // Set fallback data without missions
        setUser(fallbackUser);
        setFeaturedMissions([]); // Fallback to empty featured missions
      } finally {
        setLoading(false);
      }
    };

    initializeHome();
    
    // Cleanup polling service on unmount
    return () => {
      playerDataPollingService.stopPolling();
      // Note: listeners are automatically cleaned up when polling stops
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fallbackUser is static data

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const formatTimeLeft = (expiresAt: Date, refreshPeriod?: string): string => {
    const now = new Date();
    let targetTime: Date;
    
    // For daily missions, calculate time until midnight
    if (refreshPeriod === 'daily') {
      targetTime = new Date();
      targetTime.setHours(23, 59, 59, 999); // End of today
    } else {
      targetTime = expiresAt;
    }
    
    const diff = targetTime.getTime() - now.getTime();
    
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
        <PoweredByContainer>
          <PoweredByLogo 
            src={gameLayerLogo}
            alt="GameLayer" 
            onError={(e) => console.log('Logo failed to load:', e)}
            onLoad={() => console.log('Logo loaded successfully')}
          />
          <PoweredByText>Powered by GameLayer</PoweredByText>
        </PoweredByContainer>
        <ProfileHeader user={user} onViewMore={handleViewProfile} />
        
        <StreakBar 
          currentStreak={user.currentStreak}
        />
        
        <Rankings />
        
        <QuickStats
          dailySteps={user.dailyStepCount}
          weeklySteps={0} // Moved to profile details
          monthlySteps={0} // Moved to profile details
          recentAchievements={achievements}
        />

        <MissionsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <MissionsHeader>
            <MissionsIcon>
              <Target size={24} />
            </MissionsIcon>
            <MissionsTitle>{featuredMissions.length > 0 ? featuredMissions[0].title : "Today's Challenges"}</MissionsTitle>
          </MissionsHeader>

          {featuredMissions.length > 0 ? (
            <MissionsList>
              {featuredMissions.slice(0, 1).map((mission) => (
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
                        {/* Show objective badge if no category/tags */}
                        {(!mission.tags || mission.tags.length === 0) && mission.targetValue && (
                          <TagBadge $tag="steps">
                            {mission.targetValue.toLocaleString()}
                          </TagBadge>
                        )}
                        {mission.tags && mission.tags.slice(0, 2).map((tag, index) => (
                          <TagBadge key={index} $tag={tag}>
                            {tag}
                          </TagBadge>
                        ))}
                      </TagsOverlay>
                      <TimeRemainingOverlay>
                        <Clock size={14} />
                        {formatTimeLeft(mission.expiresAt, mission.type)}
                      </TimeRemainingOverlay>
                    </HeroImage>
                  </HeroImageSection>
                  
                  <CardContent>
                    <MissionHeader>
                    <MissionInfo>
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
              
              {featuredMissions.length > 1 && (
                <>
                  {featuredMissions.slice(1, 3).map((mission) => (
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
                            // Single objective
                            <>
                              <ProgressText>
                                <ProgressCurrent>
                                  {mission.currentProgress?.toLocaleString() || 0} / {mission.targetValue?.toLocaleString() || 0}
                                </ProgressCurrent>
                              </ProgressText>
                              <ProgressBar>
                                <ProgressFill
                                  $progress={getProgressPercentage(mission.currentProgress || 0, mission.targetValue || 1)}
                                />
                              </ProgressBar>
                              <ProgressPercentage>
                                {Math.round(getProgressPercentage(mission.currentProgress || 0, mission.targetValue || 1))}% complete
                              </ProgressPercentage>
                            </>
                          )}
                        </ProgressSection>

                        </CardContent>
                      </MissionCard>
                    ))}
                </>
              )}
            </MissionsList>
          ) : (
            <EmptyState>
              <EmptyStateIcon>🎯</EmptyStateIcon>
              <EmptyStateText>No featured missions right now</EmptyStateText>
              <ViewAllButton
                variant="primary"
                onClick={() => {}}
              >
                No Missions Available
              </ViewAllButton>
            </EmptyState>
          )}
        </MissionsContainer>

        <TodaysRewards />

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

