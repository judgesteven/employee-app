import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { Achievement } from '../types';
import { gameLayerApi } from '../services/gameLayerApi';

const AchievementsContainer = styled(Container)`
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

const FilterSection = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  overflow-x: auto;
  padding-bottom: ${theme.spacing.xs};
  scroll-behavior: smooth;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const FilterButton = styled(Button)<{ $isActive: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  white-space: nowrap;
  flex-shrink: 0;
  
  ${props => props.$isActive && `
    background: ${theme.colors.primary};
    color: ${theme.colors.text.inverse};
    border-color: ${theme.colors.primary};
  `}
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: ${theme.spacing.lg};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 48px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
  
  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.tertiary};
  width: 20px;
  height: 20px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled(motion.div)`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  text-align: center;
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${theme.spacing.md};
`;

const AchievementCard = styled(motion.div)<{ $bgColor?: string }>`
  background: ${props => props.$bgColor || 'linear-gradient(135deg, #FFE4E1, #FFF0F5)'};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 220px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
`;

const AchievementStatusBadge = styled.div<{ $status: 'completed' | 'started' | 'locked' }>`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  padding: 2px ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: capitalize;
  
  ${props => {
    switch (props.$status) {
      case 'completed':
        return `
          background: ${theme.colors.success};
          color: white;
        `;
      case 'started':
        return `
          background: ${theme.colors.primary};
          color: white;
        `;
      case 'locked':
        return `
          background: ${theme.colors.text.tertiary};
          color: white;
        `;
    }
  }}
`;

const AchievementBadgeContainer = styled.div`
  margin: ${theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const AchievementBadgeImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;

const AchievementIcon = styled.div`
  font-size: 48px;
  line-height: 1;
`;

const AchievementCategoryTag = styled.div`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: ${theme.spacing.sm};
`;

const AchievementInfo = styled.div`
  width: 100%;
`;

const AchievementName = styled.h3`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: ${theme.spacing.xs} 0;
  line-height: 1.2;
`;

const AchievementDescription = styled.p`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.sm};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AchievementProgress = styled.div`
  width: 100%;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: 4px;
`;

const ProgressFill = styled.div<{ $progress: number; $status: 'completed' | 'started' | 'locked' }>`
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
  
  ${props => {
    switch (props.$status) {
      case 'completed':
        return `background: ${theme.colors.success};`;
      case 'started':
        return `background: ${theme.colors.primary};`;
      case 'locked':
        return `background: ${theme.colors.text.tertiary};`;
    }
  }}
`;

const ProgressText = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
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

// Mock achievements data (same as ProfileDetails for consistency)
const mockAchievements: Achievement[] = [
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
      backgroundColor: 'linear-gradient(135deg, #FFE4B5, #FFEFD5)',
      badgeImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&h=120&fit=crop'
    },
    {
      id: '2',
      name: 'Step Master',
      description: 'Reach 10,000 steps in a day',
      icon: '👟',
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      category: 'FITNESS',
      status: 'completed' as const,
      currentProgress: 10000,
      totalSteps: 10000,
      backgroundColor: 'linear-gradient(135deg, #E0FFFF, #F0FFFF)',
      badgeImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=120&h=120&fit=crop'
    },
    {
      id: '3',
      name: 'Consistency King',
      description: 'Complete challenges for 7 days straight',
      icon: '🔥',
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: 'STREAKS',
      status: 'completed' as const,
      currentProgress: 7,
      totalSteps: 7,
      backgroundColor: 'linear-gradient(135deg, #FFE4E1, #FFF0F5)',
      badgeImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop'
    },
    {
      id: '4',
      name: 'Marathon Walker',
      description: 'Walk 50,000 steps in a week',
      icon: '🏃‍♂️',
      unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      category: 'FITNESS',
      status: 'completed' as const,
      currentProgress: 50000,
      totalSteps: 50000,
      backgroundColor: 'linear-gradient(135deg, #E6E6FA, #F8F8FF)',
      badgeImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=120&h=120&fit=crop'
    },
    {
      id: '5',
      name: 'Gem Collector',
      description: 'Earn 1000 gems total',
      icon: '💎',
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      category: 'REWARDS',
      status: 'completed' as const,
      currentProgress: 1000,
      totalSteps: 1000,
      backgroundColor: 'linear-gradient(135deg, #F0F8FF, #E0FFFF)',
      badgeImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop'
    },
    {
      id: '6',
      name: 'Social Butterfly',
      description: 'Share achievements with friends',
      icon: '🦋',
      unlockedAt: undefined,
      category: 'SOCIAL',
      status: 'started' as const,
      currentProgress: 2,
      totalSteps: 5,
      backgroundColor: 'linear-gradient(135deg, #F0F8FF, #E0FFFF)',
      badgeImage: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=120&h=120&fit=crop'
    },
    {
      id: '7',
      name: 'Early Bird',
      description: 'Complete morning challenges',
      icon: '🌅',
      unlockedAt: undefined,
      category: 'DAILY CHALLENGES',
      status: 'locked' as const,
      currentProgress: 0,
      totalSteps: 3,
      backgroundColor: 'linear-gradient(135deg, #FFF8DC, #FFFACD)',
    },
    {
      id: '8',
      name: 'Team Player',
      description: 'Participate in team challenges',
      icon: '🤝',
      unlockedAt: undefined,
      category: 'TEAM',
      status: 'locked' as const,
      currentProgress: 0,
      totalSteps: 1,
      backgroundColor: 'linear-gradient(135deg, #E0FFFF, #F0FFFF)',
    },
];

export const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    const initializeAchievements = async () => {
      try {
        setLoading(true);

        // Get achievements from GameLayer API
        const apiAchievements = await gameLayerApi.getAchievements();
        console.log('Achievements: Fetched achievements from GameLayer API:', apiAchievements);
        
        // Use API achievements if available, otherwise fall back to mock data
        const finalAchievements = apiAchievements.length > 0 ? apiAchievements : mockAchievements;
        setAchievements(finalAchievements);
      } catch (err) {
        console.error('Error loading achievements:', err);
        // Fallback to mock data if GameLayer API fails
        setAchievements(mockAchievements);
      } finally {
        setLoading(false);
      }
    };

    initializeAchievements();
  }, []);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'started', label: 'In Progress' },
    { key: 'locked', label: 'Locked' },
  ];

  const categories = Array.from(new Set(achievements.map(a => a.category).filter(Boolean)));
  const categoryFilters = categories.map(category => ({ key: category!, label: category! }));

  const allFilters = [...filters, ...categoryFilters];

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return achievement.status === 'completed';
    if (activeFilter === 'started') return achievement.status === 'started';
    if (activeFilter === 'locked') return achievement.status === 'locked';
    
    return achievement.category === activeFilter;
  });

  const completedCount = achievements.filter(a => a.status === 'completed').length;
  const inProgressCount = achievements.filter(a => a.status === 'started').length;
  const totalCount = achievements.length;

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
      <AchievementsContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: `3px solid ${theme.colors.border}`, borderTop: `3px solid ${theme.colors.primary}`, borderRadius: '50%' }} />
        </div>
      </AchievementsContainer>
    );
  }

  return (
    <AchievementsContainer>
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
            <Title>Achievements</Title>
          </HeaderLeft>
        </Header>

        <StatsRow>
          <StatCard variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <StatValue>{completedCount}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatCard>
          <StatCard variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <StatValue>{inProgressCount}</StatValue>
            <StatLabel>In Progress</StatLabel>
          </StatCard>
          <StatCard variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <StatValue>{totalCount}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatCard>
        </StatsRow>

        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search achievements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <FilterSection>
          {allFilters.map((filter) => (
            <FilterButton
              key={filter.key}
              variant="ghost"
              size="sm"
              $isActive={activeFilter === filter.key}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterSection>

        {filteredAchievements.length > 0 ? (
          <AchievementsGrid>
            {filteredAchievements.map((achievement) => {
              const progressPercentage = achievement.totalSteps 
                ? (achievement.currentProgress || 0) / achievement.totalSteps * 100 
                : achievement.status === 'completed' ? 100 : 0;

              return (
                <AchievementCard
                  key={achievement.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  $bgColor={achievement.backgroundColor}
                >
                  <AchievementStatusBadge $status={achievement.status}>
                    {achievement.status}
                  </AchievementStatusBadge>

                  <AchievementBadgeContainer>
                    {achievement.badgeImage ? (
                      <AchievementBadgeImage 
                        src={achievement.badgeImage} 
                        alt={achievement.name}
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          const iconElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (iconElement) iconElement.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <AchievementIcon style={{ display: achievement.badgeImage ? 'none' : 'block' }}>
                      {achievement.icon}
                    </AchievementIcon>
                  </AchievementBadgeContainer>

                  {achievement.category && (
                    <AchievementCategoryTag>
                      {achievement.category}
                    </AchievementCategoryTag>
                  )}

                  <AchievementInfo>
                    <AchievementName>{achievement.name}</AchievementName>
                    <AchievementDescription>{achievement.description}</AchievementDescription>
                    
                    <AchievementProgress>
                      <ProgressBar>
                        <ProgressFill 
                          $progress={progressPercentage} 
                          $status={achievement.status}
                        />
                      </ProgressBar>
                      <ProgressText>
                        {achievement.totalSteps 
                          ? `${achievement.currentProgress || 0} / ${achievement.totalSteps} steps`
                          : achievement.status === 'completed' ? 'Completed!' : 'In Progress'
                        }
                      </ProgressText>
                    </AchievementProgress>
                  </AchievementInfo>
                </AchievementCard>
              );
            })}
          </AchievementsGrid>
        ) : (
          <EmptyState>
            <EmptyStateIcon>🏆</EmptyStateIcon>
            <EmptyStateText>
              {searchTerm || activeFilter !== 'all' 
                ? 'No achievements match your search criteria'
                : 'No achievements available yet'
              }
            </EmptyStateText>
          </EmptyState>
        )}
      </motion.div>
    </AchievementsContainer>
  );
};
