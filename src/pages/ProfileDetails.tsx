import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Trophy, Gift, TrendingUp, Calendar, Footprints, Gem, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { User, Challenge, Reward } from '../types';

const ProfileDetailsContainer = styled(Container)`
  padding-top: ${theme.spacing.lg};
  padding-bottom: calc(80px + ${theme.spacing.lg});
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
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
  
  /* Ensure the gradient background is always maintained */
  &:hover {
    background: ${theme.colors.gradients.primary};
  }
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
  margin-bottom: ${theme.spacing.lg};
`;

const BadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.full};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const BadgeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const BadgeText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BadgeValue = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: 1;
`;

const BadgeLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  opacity: 0.8;
  margin-top: 2px;
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

// Additional stats components
const AdditionalStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
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

const StatCardValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  line-height: 1;
`;

const StatCardLabel = styled.div`
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

export const ProfileDetails: React.FC = () => {
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
    dailyStepCount: 7843,
    allTimeStepCount: 2847392,
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
      {
        id: '4',
        name: 'Marathon Walker',
        description: 'Walk 50,000 steps in a week',
        icon: '🏃‍♂️',
        unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: '5',
        name: 'Gem Collector',
        description: 'Earn 1000 gems total',
        icon: '💎',
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
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
    // Simulate API call
    setTimeout(() => {
      setUser(mockUser);
      setCompletedMissions(mockCompletedMissions);
      setClaimedRewards(mockClaimedRewards);
      setLoading(false);
    }, 1000);
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
    setExpandedSection(expandedSection === 'achievements' ? null : 'achievements');
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
      <ProfileDetailsContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: `3px solid ${theme.colors.border}`, borderTop: `3px solid ${theme.colors.primary}`, borderRadius: '50%' }} />
        </div>
      </ProfileDetailsContainer>
    );
  }

  if (!user) {
    return (
      <ProfileDetailsContainer>
        <Header>
          <BackButton variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Profile Details</Title>
        </Header>
        <div>No user data available</div>
      </ProfileDetailsContainer>
    );
  }

  return (
    <ProfileDetailsContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header>
          <BackButton variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Profile Details</Title>
        </Header>

        <ProfileSummary>
          <Avatar src={user.avatar} alt={user.name} />
          <UserName>{user.name}</UserName>
          <UserLevel>Level {user.level}</UserLevel>
          
          <BadgesContainer>
            <Badge>
              <BadgeIcon>
                <Footprints size={24} />
              </BadgeIcon>
              <BadgeText>
                <BadgeValue>{formatNumber(user.allTimeStepCount)}</BadgeValue>
                <BadgeLabel>Total Steps</BadgeLabel>
              </BadgeText>
            </Badge>
            
            <Badge>
              <BadgeIcon>
                <Gem size={24} />
              </BadgeIcon>
              <BadgeText>
                <BadgeValue>{user.gems.toLocaleString()}</BadgeValue>
                <BadgeLabel>Gems</BadgeLabel>
              </BadgeText>
            </Badge>
          </BadgesContainer>
        </ProfileSummary>

        <AdditionalStatsGrid>
          <StatCard variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <StatIcon color={theme.colors.primary}>
              <TrendingUp size={24} />
            </StatIcon>
            <StatCardValue>{formatNumber(user.dailyStepCount * 7)}</StatCardValue>
            <StatCardLabel>This Week</StatCardLabel>
            <StatChange positive={true}>+12% from last week</StatChange>
          </StatCard>

          <StatCard variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <StatIcon color={theme.colors.secondary}>
              <Calendar size={24} />
            </StatIcon>
            <StatCardValue>{formatNumber(user.dailyStepCount * 30)}</StatCardValue>
            <StatCardLabel>This Month</StatCardLabel>
            <StatChange positive={true}>+8% from last month</StatChange>
          </StatCard>
        </AdditionalStatsGrid>

        <Section>
          <SectionHeader>
            <SectionTitleArea>
              <Award color={theme.colors.accent} size={24} />
              <SectionTitle>Achievements</SectionTitle>
              <SectionCount>{user.achievements.filter(a => a.unlockedAt).length}</SectionCount>
            </SectionTitleArea>
            {user.achievements.filter(a => a.unlockedAt).length > 3 && (
              <ViewAllButton
                variant="ghost"
                size="sm"
                onClick={handleViewAllAchievements}
              >
                {expandedSection === 'achievements' ? 'Show Less' : 'View All'}
                <ChevronRight size={16} style={{ 
                  transform: expandedSection === 'achievements' ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease-in-out'
                }} />
              </ViewAllButton>
            )}
          </SectionHeader>
          
          <ItemsList>
            {user.achievements.filter(a => a.unlockedAt)
              .slice(0, expandedSection === 'achievements' ? undefined : 3)
              .map((achievement) => (
              <AchievementItem
                key={achievement.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <AchievementIcon>{achievement.icon}</AchievementIcon>
                <ItemInfo>
                  <ItemName>{achievement.name}</ItemName>
                  <ItemDescription>{achievement.description}</ItemDescription>
                  <ItemDate>Unlocked {formatDate(achievement.unlockedAt!)}</ItemDate>
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
    </ProfileDetailsContainer>
  );
};
