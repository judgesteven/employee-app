import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Clock, Gem } from 'lucide-react';
import { Container, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { Challenge } from '../types';
import { gameLayerApi } from '../services/gameLayerApi';

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

const ChallengeTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xs};
`;

const ChallengeTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
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

const ChallengeImage = styled.img`
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

const ChallengeType = styled.div<{ type: string }>`
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
          background: #8B5CF620;
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
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
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
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      completed: false,
      icon: '🏆',
      tags: ['habit', 'streak'],
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
      tags: ['marathon', 'long-term'],
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
      tags: ['evening', 'relaxation'],
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
      tags: ['weekend', 'intensive'],
    },
  ];

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const missions = await gameLayerApi.getMissions();
        console.log('Fetched missions from GameLayer API:', missions);
        setChallenges(missions);
      } catch (error) {
        console.error('Error fetching missions:', error);
        // Fallback to mock data on error
        setChallenges(mockChallenges);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const filteredChallenges = challenges.filter(challenge => {
    if (activeFilter === 'all') return true;
    return challenge.type === activeFilter;
  });

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
                  <ChallengeTitleContainer>
                    <ChallengeTitle>{challenge.title}</ChallengeTitle>
                  </ChallengeTitleContainer>
                  <ChallengeDescription>{challenge.description}</ChallengeDescription>
                  <TagsAndCategoryContainer>
                    <ChallengeType type={challenge.type}>
                      {challenge.type}
                    </ChallengeType>
                    {challenge.tags && challenge.tags.length > 0 && (
                      <>
                        {challenge.tags.map((tag, index) => (
                          <TagBadge key={index} $tag={tag}>
                            {tag}
                          </TagBadge>
                        ))}
                      </>
                    )}
                  </TagsAndCategoryContainer>
                </ChallengeInfo>
                {challenge.imgUrl ? (
                  <ChallengeImage src={challenge.imgUrl} alt={challenge.title} />
                ) : (
                  <ChallengeIcon>{challenge.icon}</ChallengeIcon>
                )}
              </ChallengeHeader>

              <ProgressSection>
                <ProgressText>
                  <ProgressCurrent>
                    {challenge.currentProgress.toLocaleString()} / {challenge.targetValue.toLocaleString()}
                  </ProgressCurrent>
                  <ProgressTarget>
                    {Math.round(getProgressPercentage(challenge.currentProgress, challenge.targetValue))}% complete
                  </ProgressTarget>
                </ProgressText>
                <ProgressBar>
                  <ProgressFill
                    $progress={getProgressPercentage(challenge.currentProgress, challenge.targetValue)}
                  />
                </ProgressBar>
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
