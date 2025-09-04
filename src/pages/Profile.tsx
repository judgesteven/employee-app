import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Gift, ChevronRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { User } from '../types';
import { gameLayerApi } from '../services/gameLayerApi';
import { ProfileHeader } from '../components/Profile/ProfileHeader';

const ProfileContainer = styled(Container)`
  padding-top: ${theme.spacing.lg};
  padding-bottom: calc(80px + ${theme.spacing.lg});
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 1) 100%);
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

const PoweredByContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: ${theme.spacing.sm};
`;

const PoweredByLogo = styled.img`
  width: 12px;
  height: 12px;
  opacity: 0.7;
`;

const PoweredByText = styled.div`
  color: ${theme.colors.text.tertiary};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatsCard = styled.div`
  background: ${theme.colors.surface.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const CardTitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const CardTitle = styled.h2`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const CardCount = styled.span`
  background: ${theme.colors.primary};
  color: white;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ViewAllButton = styled(Button)`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  height: auto;
  min-height: auto;
`;

const StatsGrid = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const StatCard = styled.div`
  flex: 1;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
`;

const SingleStatContent = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  text-transform: capitalize;
`;

const RedeemedPrizesCard = styled.div`
  background: ${theme.colors.surface.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
`;

const CardContent = styled.div`
  /* Content styling */
`;

const PrizesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.md};
`;

const PrizeCard = styled(motion.div)`
  background: ${theme.colors.surface.secondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.lg};
  }
`;

const PrizeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const PrizeName = styled.h3`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const PrizeDescription = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const RedeemedDate = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.tertiary};
  font-style: italic;
`;

const EmptyState = styled.div`
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const EmptyStateText = styled.p`
  color: rgba(239, 68, 68, 0.8);
  font-size: ${theme.typography.fontSize.base};
  margin: 0;
`;

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [redeemedPrizes, setRedeemedPrizes] = useState<any[]>([]);
  const [weeklySteps, setWeeklySteps] = useState(0);
  const [monthlySteps, setMonthlySteps] = useState(0);
  const [allTimeSteps, setAllTimeSteps] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch player data
        const gameLayerPlayer = await gameLayerApi.getPlayer();
        
        // Fetch team data
        let teamName = gameLayerPlayer.team || '';
        if (gameLayerPlayer.team) {
          try {
            const teamData = await gameLayerApi.getTeam(gameLayerPlayer.team);
            teamName = teamData.team?.name || gameLayerPlayer.team;
          } catch (error) {
            console.error('Error fetching team data:', error);
          }
        }

        // Fetch step count from daily-step-tracker mission
        let stepCountFromMission = 0;
        try {
          const dailyStepMission = await gameLayerApi.getPlayerMission(undefined, 'daily-step-tracker');
          stepCountFromMission = dailyStepMission?.objectives?.events?.count ?? 0;
        } catch (error) {
          stepCountFromMission = gameLayerPlayer.points ?? 0; // Fallback to points from API
        }

        const updatedUser: User = {
          id: gameLayerPlayer.player || 'unknown',
          name: gameLayerPlayer.name || 'Unknown User',
          avatar: gameLayerPlayer.imgUrl || '/default-avatar.png',
          level: 0,
          team: teamName,
          dailyStepCount: stepCountFromMission,
          allTimeStepCount: gameLayerPlayer.points ?? 0,
          dailyActiveMinutes: 0,
          allTimeActiveMinutes: 0,
          gems: gameLayerPlayer.credits ?? 0,
          xp: 0,
          achievements: [],
          currentStreak: 8, // Mock data
          longestStreak: 15 // Mock data
        };

        setUser(updatedUser);

        // Fetch redeemed prizes
        try {
          const prizes = await gameLayerApi.getPlayerPrizes();
          setRedeemedPrizes(Array.isArray(prizes) ? prizes : []);
        } catch (error) {
          console.error('Error fetching redeemed prizes:', error);
          setRedeemedPrizes([]);
        }

        // Fetch weekly, monthly, and all-time steps
        try {
          const [weeklyMission, monthlyMission, allTimeMission] = await Promise.all([
            gameLayerApi.getPlayerMission(undefined, 'weekly-step-tracker').catch(() => null),
            gameLayerApi.getPlayerMission(undefined, 'monthly-step-tracker').catch(() => null),
            gameLayerApi.getPlayerMission(undefined, 'all-time-step-tracker').catch(() => null)
          ]);

          setWeeklySteps(weeklyMission?.objectives?.events?.count ?? 0);
          setMonthlySteps(monthlyMission?.objectives?.events?.count ?? 0);
          setAllTimeSteps(allTimeMission?.objectives?.events?.count ?? 0);
        } catch (error) {
          console.error('Error fetching step data:', error);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleViewAllRewards = () => {
    setExpandedSection(expandedSection === 'rewards' ? null : 'rewards');
  };

  if (loading) {
    return (
      <ProfileContainer>
        <div>Loading...</div>
      </ProfileContainer>
    );
  }

  if (!user) {
    return (
      <ProfileContainer>
        <div>Error loading profile</div>
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

        <PoweredByContainer>
          <PoweredByLogo src="/B&W_Logo_0.5.png" alt="GameLayer" />
          <PoweredByText>Powered by GameLayer</PoweredByText>
        </PoweredByContainer>
        
        <ProfileHeader 
          user={user} 
          onViewMore={() => {}} 
        />

        <StatsCard>
          <CardHeader>
            <CardTitleArea>
              <Trophy color={theme.colors.primary} size={20} />
              <CardTitle>Stats</CardTitle>
            </CardTitleArea>
          </CardHeader>
          <StatsGrid>
            <StatCard>
              <SingleStatContent>
                <StatValue>{formatNumber(weeklySteps)}</StatValue>
                <StatLabel>weekly steps</StatLabel>
              </SingleStatContent>
            </StatCard>
            <StatCard>
              <SingleStatContent>
                <StatValue>{formatNumber(monthlySteps)}</StatValue>
                <StatLabel>monthly steps</StatLabel>
              </SingleStatContent>
            </StatCard>
            <StatCard>
              <SingleStatContent>
                <StatValue>{formatNumber(allTimeSteps)}</StatValue>
                <StatLabel>all-time steps</StatLabel>
              </SingleStatContent>
            </StatCard>
          </StatsGrid>
        </StatsCard>

        <RedeemedPrizesCard>
          <CardHeader>
            <CardTitleArea>
              <Gift color={theme.colors.primary} size={20} />
              <CardTitle>Redeemed Prizes</CardTitle>
              {redeemedPrizes.length > 0 && <CardCount>{redeemedPrizes.length}</CardCount>}
            </CardTitleArea>
            {redeemedPrizes.length > 3 && (
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
          </CardHeader>
          <CardContent>
            {redeemedPrizes.length > 0 ? (
              <PrizesGrid>
                {redeemedPrizes
                  .slice(0, expandedSection === 'rewards' ? undefined : 6)
                  .map((prize) => (
                  <PrizeCard
                    key={prize.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <PrizeInfo>
                      <PrizeName>{prize.name}</PrizeName>
                      <PrizeDescription>{prize.description}</PrizeDescription>
                      <RedeemedDate>Redeemed recently</RedeemedDate>
                    </PrizeInfo>
                  </PrizeCard>
                ))}
              </PrizesGrid>
            ) : (
              <EmptyState>
                <EmptyStateText>no prizes redeemed yet</EmptyStateText>
              </EmptyState>
            )}
          </CardContent>
        </RedeemedPrizesCard>
      </motion.div>
    </ProfileContainer>
  );
};