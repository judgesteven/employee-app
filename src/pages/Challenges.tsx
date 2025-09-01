import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Clock, Gem } from 'lucide-react';
import { Container, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { Challenge } from '../types';

const ChallengesContainer = styled(Container)`
  padding-top: ${theme.spacing.lg};
  padding-bottom: calc(80px + ${theme.spacing.lg});
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.base};
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
`;

const FilterTab = styled(Button)<{ $isActive: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$isActive ? theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? theme.colors.text.inverse : theme.colors.text.secondary};
  border: none;
  
  &:hover {
    background: ${props => props.$isActive ? theme.colors.primary : theme.colors.surfaceHover};
    color: ${props => props.$isActive ? theme.colors.text.inverse : theme.colors.text.primary};
    transform: none;
  }
`;

const ChallengesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ChallengeCard = styled(motion.div)`
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

const ChallengeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const ChallengeInfo = styled.div`
  flex: 1;
`;

const ChallengeTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const ChallengeDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  margin-bottom: ${theme.spacing.sm};
`;

const ChallengeIcon = styled.div`
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

const ChallengeFooter = styled.div`
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



type FilterType = 'all' | 'daily' | 'weekly' | 'monthly';

export const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  // Mock challenges data - in production this would come from GameLayer API
  // Only showing incomplete/available challenges here
  const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Step Sprint',
      description: 'Take 8,000 steps today',
      type: 'daily',
      targetValue: 8000,
      currentProgress: 5243,
      reward: 50,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
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
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
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
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      completed: false,
      icon: '🏆',
    },
    {
      id: '5',
      title: 'Monthly Marathon',
      description: 'Walk 200,000 steps this month',
      type: 'monthly',
      targetValue: 200000,
      currentProgress: 87650,
      reward: 500,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      completed: false,
      icon: '🎯',
    },
    {
      id: '6',
      title: 'Evening Stroll',
      description: 'Take 3,000 steps after 6 PM',
      type: 'daily',
      targetValue: 3000,
      currentProgress: 850,
      reward: 35,
      expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      completed: false,
      icon: '🌙',
    },
    {
      id: '7',
      title: 'Weekend Warrior',
      description: 'Complete 15,000 steps on weekend days',
      type: 'daily',
      targetValue: 15000,
      currentProgress: 2340,
      reward: 75,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      completed: false,
      icon: '🎉',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChallenges(mockChallenges);
      setLoading(false);
    }, 1000);
  }, []); // mockChallenges is static data, no need to include in dependencies

  const filteredChallenges = challenges.filter(challenge => {
    if (activeFilter === 'all') return true;
    return challenge.type === activeFilter;
  });

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
      <ChallengesContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: `3px solid ${theme.colors.border}`, borderTop: `3px solid ${theme.colors.primary}`, borderRadius: '50%' }} />
        </div>
      </ChallengesContainer>
    );
  }

  return (
    <ChallengesContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header>
          <Title>Challenges</Title>
          <Subtitle>Complete challenges to earn gems and unlock achievements</Subtitle>
        </Header>

        <FilterTabs>
          <FilterTab
            $isActive={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            All
          </FilterTab>
          <FilterTab
            $isActive={activeFilter === 'daily'}
            onClick={() => setActiveFilter('daily')}
          >
            Daily
          </FilterTab>
          <FilterTab
            $isActive={activeFilter === 'weekly'}
            onClick={() => setActiveFilter('weekly')}
          >
            Weekly
          </FilterTab>
          <FilterTab
            $isActive={activeFilter === 'monthly'}
            onClick={() => setActiveFilter('monthly')}
          >
            Monthly
          </FilterTab>
        </FilterTabs>

        <ChallengesList>
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChallengeHeader>
                <ChallengeInfo>
                  <ChallengeTitle>{challenge.title}</ChallengeTitle>
                  <ChallengeDescription>{challenge.description}</ChallengeDescription>
                </ChallengeInfo>
                <ChallengeIcon>{challenge.icon}</ChallengeIcon>
              </ChallengeHeader>

              <ProgressSection>
                <ProgressBar>
                  <ProgressFill
                    $progress={getProgressPercentage(challenge.currentProgress, challenge.targetValue)}
                  />
                </ProgressBar>
                <ProgressText>
                  <ProgressCurrent>
                    {challenge.currentProgress.toLocaleString()} / {challenge.targetValue.toLocaleString()}
                  </ProgressCurrent>
                  <ProgressTarget>
                    {Math.round(getProgressPercentage(challenge.currentProgress, challenge.targetValue))}%
                  </ProgressTarget>
                </ProgressText>
              </ProgressSection>

              <ChallengeFooter>
                <RewardInfo>
                  <Gem size={16} />
                  <span>{challenge.reward} gems</span>
                </RewardInfo>
                <TimeLeft>
                  <Clock size={16} />
                  <span>{formatTimeLeft(challenge.expiresAt)}</span>
                </TimeLeft>
              </ChallengeFooter>
            </ChallengeCard>
          ))}
        </ChallengesList>
      </motion.div>
    </ChallengesContainer>
  );
};
