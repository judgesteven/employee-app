import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Trophy, Gift, Gem, ChevronRight, Clock, Zap } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { User, Challenge, Reward } from '../types';
import { gameLayerApi } from '../services/gameLayerApi';

// Level badge color helper
const getLevelBadgeColor = (levelName: string) => {
  const name = levelName.toLowerCase();
  
  if (name.includes('bronze')) {
    return '#CD7F32';
  } else if (name.includes('silver')) {
    return '#C0C0C0';
  } else if (name.includes('gold')) {
    return '#FFD700';
  } else if (name.includes('diamond')) {
    return '#00BFFF';
  } else {
    return '#6B73FF'; // Default fallback
  }
};

const ProfileContainer = styled(Container)`
  padding-top: ${theme.spacing.lg};
  padding-bottom: calc(80px + ${theme.spacing.lg});
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const BackButton = styled(Button)`
  padding: ${theme.spacing.sm};
  min-height: auto;
  width: 44px;
  height: 44px;
  border-radius: ${theme.borderRadius.full};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
`;


const ProfileSummary = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  background: ${theme.colors.gradients.primary};
  color: ${theme.colors.text.inverse};
  border: none;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  position: relative;
  
  /* Ensure the gradient background is always maintained */
  &:hover {
    background: ${theme.colors.gradients.primary};
  }
`;

const GemsCornerBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const GemsCount = styled.span`
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.base};
`;

const XPBadge = styled.div`
  position: absolute;
  top: calc(${theme.spacing.md} + 50px); /* Position below gems badge */
  right: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const XPCount = styled.span`
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.base};
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: ${theme.borderRadius.full};
  border: 4px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
  margin-bottom: ${theme.spacing.md};
`;

const UserName = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.sm};
`;

const UserLevel = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  opacity: 0.9;
  margin-bottom: ${theme.spacing.xs};
`;

const LevelBadge = styled.span<{ levelName: string }>`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: white;
  background: ${({ levelName }) => getLevelBadgeColor(levelName)};
  margin-bottom: ${theme.spacing.xs};
`;

const UserTeam = styled.div`
  font-size: ${theme.typography.fontSize.base};
  opacity: 0.8;
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing.lg};
`;

const ProfileStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const ProfileStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ProfileStatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const ProfileStatInfo = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${theme.spacing.xs};
`;

const ProfileStatCount = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: 1;
`;

const ProfileStatLabel = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  opacity: 0.8;
  font-weight: ${theme.typography.fontWeight.medium};
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

const SectionTitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const SectionCount = styled.span`
  background: ${theme.colors.primary};
  color: ${theme.colors.text.inverse};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const ViewAllButton = styled(Button)`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const ItemDescription = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  margin-bottom: ${theme.spacing.xs};
`;

const ItemDate = styled.div`
  color: ${theme.colors.text.tertiary};
  font-size: ${theme.typography.fontSize.xs};
`;

const MissionItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  position: relative;
  
  &:hover {
    border-color: ${theme.colors.success};
  }
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: ${theme.colors.success};
  color: ${theme.colors.text.inverse};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const MissionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.gradients.success};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.xl};
`;

const RewardItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  
  &:hover {
    border-color: ${theme.colors.accent};
  }
`;

const RewardIcon = styled.div<{ bgColor: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.xl};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
`;

const EmptyStateIcon = styled.div`
  font-size: ${theme.typography.fontSize['4xl']};
  margin-bottom: ${theme.spacing.md};
`;

const EmptyStateText = styled.p`
  font-size: ${theme.typography.fontSize.base};
`;

// Original achievement components (vertical list design)
const AchievementItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const AchievementIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.gradients.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.text.inverse};
`;

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [completedMissions, setCompletedMissions] = useState<Challenge[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Mock data - in production this would come from GameLayer API
  const mockUser: User = {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 12,
    team: 'Marketing Team',
    dailyStepCount: 7843,
    allTimeStepCount: 2847392,
    dailyActiveMinutes: 78,
    allTimeActiveMinutes: 156420,
    gems: 1247,
    xp: 8450,
    achievements: [], // Will be populated from GameLayer API
    currentStreak: 7,
    longestStreak: 23,
  };

  const mockCompletedMissions: Challenge[] = [
    {
      id: 'completed-1',
      title: 'Morning Walker',
      description: 'Complete 2,000 steps before 10 AM',
      type: 'daily',
      targetValue: 2000,
      currentProgress: 2000,
      reward: 30,
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      completed: true,
      icon: '🌅',
    },
    {
      id: 'completed-2',
      title: 'Step Sprint',
      description: 'Take 8,000 steps in a day',
      type: 'daily',
      targetValue: 8000,
      currentProgress: 8000,
      reward: 50,
      expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completed: true,
      icon: '🏃‍♂️',
    },
    {
      id: 'completed-3',
      title: 'Weekly Warrior',
      description: 'Accumulate 50,000 steps this week',
      type: 'weekly',
      targetValue: 50000,
      currentProgress: 50000,
      reward: 200,
      expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completed: true,
      icon: '⚡',
    },
  ];

  const mockClaimedRewards: Reward[] = [
    {
      id: 'claimed-1',
      name: 'Coffee Voucher',
      description: 'Free coffee and pastry at local coffee shops',
      cost: 150,
      image: '☕',
      category: 'food',
      available: true,
      claimed: true,
    },
    {
      id: 'claimed-2',
      name: 'Cinema Tickets',
      description: 'Two tickets to any movie at participating cinemas',
      cost: 500,
      image: '🎬',
      category: 'entertainment',
      available: true,
      claimed: true,
    },
  ];

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);

        // Get player data from GameLayer API
        const gameLayerPlayer = await gameLayerApi.getPlayer();
        
        // Get team name if team ID is available
        let teamName = mockUser.team;
        if (gameLayerPlayer.team) {
          try {
            const teamData = await gameLayerApi.getTeam(gameLayerPlayer.team);
            teamName = teamData.team?.name || gameLayerPlayer.team; // Use team name from nested structure or fallback to team ID
          } catch (error) {
            teamName = gameLayerPlayer.team; // Fallback to team ID if API call fails
          }
        }
        
        // Update user data with real GameLayer name, avatar, level, credits, team, and step count
        const updatedUser = {
          ...mockUser,
          name: gameLayerPlayer.name, // Use name from GameLayer API
          avatar: gameLayerPlayer.imgUrl || mockUser.avatar, // Use avatar from GameLayer API or fallback to mock
          level: gameLayerPlayer.level?.number || mockUser.level, // Use level number from GameLayer API
          levelName: gameLayerPlayer.level?.name, // Use level name from GameLayer API
          team: teamName, // Use resolved team name
          gems: gameLayerPlayer.credits ?? 0, // Use credits from GameLayer API, default to 0 if not available
          dailyStepCount: gameLayerPlayer.points ?? 0, // Use points from GameLayer API as step count, default to 0 if not available
          allTimeStepCount: gameLayerPlayer.points ?? mockUser.allTimeStepCount, // Use points as lifetime steps or fallback to mock
        };

        setUser(updatedUser);
        setCompletedMissions(mockCompletedMissions);
        setClaimedRewards(mockClaimedRewards);
      } catch (err) {
        console.error('Error loading profile:', err);
        // Fallback to mock data if GameLayer API fails
        setUser(mockUser);
        setCompletedMissions(mockCompletedMissions);
        setClaimedRewards(mockClaimedRewards);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mockUser, mockCompletedMissions, and mockClaimedRewards are static data

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
  };

  const getRewardBackgroundColor = (category: string): string => {
    switch (category) {
      case 'entertainment': return theme.colors.primary + '20';
      case 'fitness': return theme.colors.success + '20';
      case 'food': return theme.colors.accent + '20';
      case 'shopping': return theme.colors.secondary + '20';
      default: return theme.colors.surface;
    }
  };

  const handleViewAllAchievements = () => {
    navigate('/achievements');
  };

  const handleViewAllMissions = () => {
    setExpandedSection(expandedSection === 'missions' ? null : 'missions');
  };

  const handleViewAllRewards = () => {
    setExpandedSection(expandedSection === 'rewards' ? null : 'rewards');
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
      <ProfileContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: `3px solid ${theme.colors.border}`, borderTop: `3px solid ${theme.colors.primary}`, borderRadius: '50%' }} />
        </div>
      </ProfileContainer>
    );
  }

  if (!user) {
    return (
      <ProfileContainer>
        <Header>
          <BackButton variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Profile</Title>
        </Header>
        <div>No user data available</div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header>
          <HeaderLeft>
            <BackButton variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </BackButton>
            <Title>Profile</Title>
          </HeaderLeft>
        </Header>

        <ProfileSummary>
          <GemsCornerBadge>
            <Gem size={16} />
            <GemsCount>{user.gems.toLocaleString()}</GemsCount>
          </GemsCornerBadge>
          
          <XPBadge>
            <Zap size={16} />
            <XPCount>{user.xp.toLocaleString()}</XPCount>
          </XPBadge>
          
          <Avatar src={user.avatar} alt={user.name} />
          <UserName>{user.name}</UserName>
          {user.levelName ? (
            <LevelBadge levelName={user.levelName}>{user.levelName}</LevelBadge>
          ) : (
            <UserLevel>Tier: {user.level}</UserLevel>
          )}
          <UserTeam>{user.team}</UserTeam>
          
          <ProfileStatsContainer>
            <ProfileStatItem>
              <ProfileStatIcon>
                👟
              </ProfileStatIcon>
              <ProfileStatInfo>
                <ProfileStatCount>{formatNumber(user.allTimeStepCount)}</ProfileStatCount>
                <ProfileStatLabel>lifetime steps</ProfileStatLabel>
              </ProfileStatInfo>
            </ProfileStatItem>
            
            <ProfileStatItem>
              <ProfileStatIcon>
                <Clock size={20} />
              </ProfileStatIcon>
              <ProfileStatInfo>
                <ProfileStatCount>{formatNumber(user.allTimeActiveMinutes)}</ProfileStatCount>
                <ProfileStatLabel>lifetime minutes</ProfileStatLabel>
              </ProfileStatInfo>
            </ProfileStatItem>
          </ProfileStatsContainer>
        </ProfileSummary>

        <Section>
          <SectionHeader>
            <SectionTitleArea>
              <Award color={theme.colors.accent} size={24} />
              <SectionTitle>Achievements</SectionTitle>
              <SectionCount>{user.achievements.filter(a => a.unlockedAt).length}</SectionCount>
            </SectionTitleArea>
            <ViewAllButton
              variant="ghost"
              size="sm"
              onClick={handleViewAllAchievements}
            >
              View All
              <ChevronRight size={16} />
            </ViewAllButton>
          </SectionHeader>
          
          <ItemsList>
            {user.achievements.filter(a => a.unlockedAt)
              .slice(0, 3)
              .map((achievement) => (
              <AchievementItem
                key={achievement.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <AchievementIcon>{achievement.icon}</AchievementIcon>
                <ItemInfo>
                  <ItemName>{achievement.title}</ItemName>
                  <ItemDescription>{achievement.description}</ItemDescription>
                  <ItemDate>Unlocked {formatDate(new Date(achievement.unlockedAt!))}</ItemDate>
                </ItemInfo>
              </AchievementItem>
            ))}
          </ItemsList>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitleArea>
              <Trophy color={theme.colors.success} size={24} />
              <SectionTitle>Completed Missions</SectionTitle>
              <SectionCount>{completedMissions.length}</SectionCount>
            </SectionTitleArea>
            {completedMissions.length > 3 && (
              <ViewAllButton
                variant="ghost"
                size="sm"
                onClick={handleViewAllMissions}
              >
                {expandedSection === 'missions' ? 'Show Less' : 'View All'}
                <ChevronRight size={16} style={{ 
                  transform: expandedSection === 'missions' ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease-in-out'
                }} />
              </ViewAllButton>
            )}
          </SectionHeader>
          
          {completedMissions.length > 0 ? (
            <ItemsList>
              {completedMissions
                .slice(0, expandedSection === 'missions' ? undefined : 3)
                .map((mission) => (
                <MissionItem
                  key={mission.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <CompletedBadge>Completed</CompletedBadge>
                  <MissionIcon>{mission.icon}</MissionIcon>
                  <ItemInfo>
                    <ItemName>{mission.title}</ItemName>
                    <ItemDescription>{mission.description}</ItemDescription>
                    <ItemDate>Completed {formatDate(mission.expiresAt)}</ItemDate>
                  </ItemInfo>
                </MissionItem>
              ))}
            </ItemsList>
          ) : (
            <EmptyState>
              <EmptyStateIcon>🎯</EmptyStateIcon>
              <EmptyStateText>No missions completed yet. Keep going!</EmptyStateText>
            </EmptyState>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitleArea>
              <Gift color={theme.colors.primary} size={24} />
              <SectionTitle>Claimed Rewards</SectionTitle>
              <SectionCount>{claimedRewards.length}</SectionCount>
            </SectionTitleArea>
            {claimedRewards.length > 3 && (
              <ViewAllButton
                variant="ghost"
                size="sm"
                onClick={handleViewAllRewards}
              >
                {expandedSection === 'rewards' ? 'Show Less' : 'View All'}
                <ChevronRight size={16} style={{ 
                  transform: expandedSection === 'rewards' ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease-in-out'
                }} />
              </ViewAllButton>
            )}
          </SectionHeader>
          
          {claimedRewards.length > 0 ? (
            <ItemsList>
              {claimedRewards
                .slice(0, expandedSection === 'rewards' ? undefined : 3)
                .map((reward) => (
                <RewardItem
                  key={reward.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <RewardIcon bgColor={getRewardBackgroundColor(reward.category)}>
                    {reward.image}
                  </RewardIcon>
                  <ItemInfo>
                    <ItemName>{reward.name}</ItemName>
                    <ItemDescription>{reward.description}</ItemDescription>
                    <ItemDate>Claimed recently</ItemDate>
                  </ItemInfo>
                </RewardItem>
              ))}
            </ItemsList>
          ) : (
            <EmptyState>
              <EmptyStateIcon>🎁</EmptyStateIcon>
              <EmptyStateText>No rewards claimed yet. Start earning gems!</EmptyStateText>
            </EmptyState>
          )}
        </Section>
      </motion.div>
    </ProfileContainer>
  );
};