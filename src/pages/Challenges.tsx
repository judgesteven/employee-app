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
  border-radius: ${theme.borderRadius.full};
`;

const FilterTab = styled(Button)<{ $isActive: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  border-radius: ${theme.borderRadius['2xl']};
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



type FilterType = 'all' | 'daily' | 'weekly' | 'monthly';



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
        
        // Filter incomplete missions and sort by priority (priority 1 is highest)
        const sortedMissions = missions
          .filter(mission => !mission.completed)
          .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        
        setChallenges(sortedMissions);
      } catch (error) {
        console.error('Error fetching missions:', error);
        setChallenges([]);
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
                    <RewardBadge $type="gems">
                      <Gem size={16} />
                      {challenge.reward}
                    </RewardBadge>
                  </RewardsOverlay>
                  <TagsOverlay>
                    <TagBadge $tag={challenge.type}>
                      {challenge.type}
                    </TagBadge>
                    {challenge.tags && challenge.tags.slice(0, 2).map((tag, index) => (
                      <TagBadge key={index} $tag={tag}>
                        {tag}
                      </TagBadge>
                    ))}
                  </TagsOverlay>
                  <TimeRemainingOverlay>
                    <Clock size={14} />
                    {formatTimeLeft(challenge.expiresAt)}
                  </TimeRemainingOverlay>
                </HeroImage>
              </HeroImageSection>
              
              <CardContent>
                <ChallengeHeader>
                <ChallengeInfo>
                  <ChallengeTitleContainer>
                    <ChallengeTitle>{challenge.title}</ChallengeTitle>
                  </ChallengeTitleContainer>
                  <ChallengeDescription>{challenge.description}</ChallengeDescription>
                </ChallengeInfo>
              </ChallengeHeader>

              <ProgressSection>
                {challenge.objectives && challenge.objectives.length > 1 ? (
                  // Multiple objectives - show each one
                  challenge.objectives.map((objective, index) => (
                                            <div key={objective.id} style={{ marginBottom: index < challenge.objectives!.length - 1 ? '16px' : '0' }}>
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
                        {challenge.currentProgress.toLocaleString()} / {challenge.targetValue.toLocaleString()}
                      </ProgressCurrent>
                    </ProgressText>
                    <ProgressBar>
                      <ProgressFill
                        $progress={getProgressPercentage(challenge.currentProgress, challenge.targetValue)}
                      />
                    </ProgressBar>
                    <ProgressPercentage>
                      {Math.round(getProgressPercentage(challenge.currentProgress, challenge.targetValue))}% complete
                    </ProgressPercentage>
                  </>
                )}
              </ProgressSection>


              </CardContent>
            </ChallengeCard>
          ))}
        </ChallengesList>
      </motion.div>
    </ChallengesContainer>
  );
};
