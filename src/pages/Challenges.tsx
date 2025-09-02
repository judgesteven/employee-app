import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Clock, Gem, Star, Diamond } from 'lucide-react';
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
  background: ${theme.colors.white};
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
  background: ${props => props.$bgImage ? `url(${props.$bgImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
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
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const CategoryBadge = styled.div`
  position: absolute;
  bottom: ${theme.spacing.md};
  left: ${theme.spacing.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardContent = styled.div`
  padding: ${theme.spacing.lg};
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
      experience: 100,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      completed: false,
      icon: '🏃‍♂️',
      imgUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
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
      experience: 350,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      completed: false,
      icon: '⚡',
      imgUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
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
      experience: 250,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      completed: false,
      icon: '🏆',
      imgUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop',
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
      experience: 750,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      completed: false,
      icon: '🎯',
      imgUrl: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=400&h=200&fit=crop',
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
      experience: 75,
      expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      completed: false,
      icon: '🌙',
      imgUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
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

export const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

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
              <HeroImageSection>
                <HeroImage $bgImage={challenge.imgUrl}>
                  <RewardsOverlay>
                    <RewardBadge $type="experience">
                      <Star size={16} />
                      {challenge.experience || 250}
                    </RewardBadge>
                    <RewardBadge $type="gems">
                      <Diamond size={16} />
                      {challenge.reward}
                    </RewardBadge>
                  </RewardsOverlay>
                  <CategoryBadge>
                    {challenge.type}
                  </CategoryBadge>
                </HeroImage>
              </HeroImageSection>
              
              <CardContent>
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
              </CardContent>
            </ChallengeCard>
          ))}
        </ChallengesList>
      </motion.div>
    </ChallengesContainer>
  );
};
