import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import { Container, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { Reward } from '../types';

const RewardsContainer = styled(Container)`
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

const GemsBalance = styled.div`
  background: ${theme.colors.gradients.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  color: ${theme.colors.text.inverse};
`;

const GemsIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GemsInfo = styled.div`
  text-align: center;
`;

const GemsCount = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: 1;
`;

const GemsLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  opacity: 0.8;
  margin-top: ${theme.spacing.xs};
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  overflow-x: auto;
`;

const CategoryTab = styled.button<{ $isActive: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$isActive ? theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? theme.colors.text.inverse : theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.$isActive ? theme.colors.primary : theme.colors.surfaceHover};
    color: ${props => props.$isActive ? theme.colors.text.inverse : theme.colors.text.primary};
  }
`;

const RewardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const RewardCard = styled(motion.div)<{ $available: boolean }>`
  background: ${theme.colors.background};
  border: 1px solid ${props => props.$available ? theme.colors.border : theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
  opacity: ${props => props.$available ? 1 : 0.6};
  
  &:hover {
    border-color: ${props => props.$available ? theme.colors.primary : theme.colors.border};
  }
`;

const RewardImage = styled.div<{ $bgColor: string }>`
  width: 100%;
  height: 120px;
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize['3xl']};
  margin-bottom: ${theme.spacing.md};
  position: relative;
`;

const RewardInfo = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const RewardName = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const RewardDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  line-height: 1.4;
`;

const RewardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RewardCost = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.accent};
`;

const ClaimButton = styled(Button)<{ $canAfford: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  
  ${props => !props.$canAfford && `
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

const UnavailableBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: ${theme.colors.error};
  color: ${theme.colors.text.inverse};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const ClaimedBadge = styled.div`
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

type RewardCategory = 'all' | 'entertainment' | 'fitness' | 'food' | 'shopping';

export const Rewards: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeCategory, setActiveCategory] = useState<RewardCategory>('all');
  const [userGems, setUserGems] = useState(1247); // Mock user gems
  const [loading, setLoading] = useState(true);

  // Mock rewards data - in production this would come from GameLayer API
  const mockRewards: Reward[] = [
    {
      id: '1',
      name: 'Cinema Tickets',
      description: 'Two tickets to any movie at participating cinemas',
      cost: 500,
      image: '🎬',
      category: 'entertainment',
      available: true,
      claimed: false,
    },
    {
      id: '2',
      name: 'Coffee Voucher',
      description: 'Free coffee and pastry at local coffee shops',
      cost: 150,
      image: '☕',
      category: 'food',
      available: true,
      claimed: false,
    },
    {
      id: '3',
      name: 'Running Shoes Raffle',
      description: 'Entry into raffle to win premium running shoes',
      cost: 300,
      image: '👟',
      category: 'fitness',
      available: true,
      claimed: false,
    },
    {
      id: '4',
      name: 'Fitness Tracker',
      description: 'Latest fitness tracking wearable device',
      cost: 2000,
      image: '⌚',
      category: 'fitness',
      available: true,
      claimed: false,
    },
    {
      id: '5',
      name: 'Restaurant Voucher',
      description: '£25 voucher for participating restaurants',
      cost: 400,
      image: '🍽️',
      category: 'food',
      available: true,
      claimed: false,
    },
    {
      id: '6',
      name: 'Shopping Credit',
      description: '£15 credit for online shopping',
      cost: 250,
      image: '🛍️',
      category: 'shopping',
      available: true,
      claimed: false,
    },
    {
      id: '7',
      name: 'Concert Tickets',
      description: 'Tickets to local music events and concerts',
      cost: 800,
      image: '🎵',
      category: 'entertainment',
      available: false, // Out of stock
      claimed: false,
    },
    {
      id: '8',
      name: 'Gym Membership',
      description: 'One month free gym membership',
      cost: 600,
      image: '💪',
      category: 'fitness',
      available: true,
      claimed: true, // Already claimed
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRewards(mockRewards);
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mockRewards is static data, no need to include in dependencies

  const filteredRewards = rewards.filter(reward => {
    if (activeCategory === 'all') return true;
    return reward.category === activeCategory;
  });

  const handleClaimReward = (rewardId: string, cost: number) => {
    if (userGems >= cost) {
      setUserGems(prev => prev - cost);
      setRewards(prev => prev.map(reward => 
        reward.id === rewardId ? { ...reward, claimed: true } : reward
      ));
      // In production, this would call GameLayer API to claim the reward
    }
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
      <RewardsContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: `3px solid ${theme.colors.border}`, borderTop: `3px solid ${theme.colors.primary}`, borderRadius: '50%' }} />
        </div>
      </RewardsContainer>
    );
  }

  return (
    <RewardsContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header>
          <Title>Rewards</Title>
          <Subtitle>Exchange your gems for amazing rewards</Subtitle>
        </Header>

        <GemsBalance>
          <GemsIcon>
            <Gem size={24} />
          </GemsIcon>
          <GemsInfo>
            <GemsCount>{userGems.toLocaleString()}</GemsCount>
            <GemsLabel>Available Gems</GemsLabel>
          </GemsInfo>
        </GemsBalance>

        <CategoryTabs>
          <CategoryTab
            $isActive={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          >
            All
          </CategoryTab>
          <CategoryTab
            $isActive={activeCategory === 'entertainment'}
            onClick={() => setActiveCategory('entertainment')}
          >
            Entertainment
          </CategoryTab>
          <CategoryTab
            $isActive={activeCategory === 'fitness'}
            onClick={() => setActiveCategory('fitness')}
          >
            Fitness
          </CategoryTab>
          <CategoryTab
            $isActive={activeCategory === 'food'}
            onClick={() => setActiveCategory('food')}
          >
            Food & Drink
          </CategoryTab>
          <CategoryTab
            $isActive={activeCategory === 'shopping'}
            onClick={() => setActiveCategory('shopping')}
          >
            Shopping
          </CategoryTab>
        </CategoryTabs>

        <RewardsGrid>
          {filteredRewards.map((reward) => {
            const canAfford = userGems >= reward.cost;
            const canClaim = reward.available && !reward.claimed && canAfford;
            
            return (
              <RewardCard
                key={reward.id}
                variants={itemVariants}
                whileHover={{ scale: reward.available ? 1.02 : 1 }}
                $available={reward.available && !reward.claimed}
              >
                {!reward.available && <UnavailableBadge>Out of Stock</UnavailableBadge>}
                {reward.claimed && <ClaimedBadge>Claimed</ClaimedBadge>}
                
                <RewardImage $bgColor={getRewardBackgroundColor(reward.category)}>
                  {reward.image}
                </RewardImage>
                
                <RewardInfo>
                  <RewardName>{reward.name}</RewardName>
                  <RewardDescription>{reward.description}</RewardDescription>
                </RewardInfo>
                
                <RewardFooter>
                  <RewardCost>
                    <Gem size={16} />
                    <span>{reward.cost}</span>
                  </RewardCost>
                  
                  <ClaimButton
                    variant="primary"
                    size="sm"
                    disabled={!canClaim}
                    $canAfford={canAfford}
                    onClick={() => canClaim && handleClaimReward(reward.id, reward.cost)}
                  >
                    {reward.claimed ? 'Claimed' : 
                     !reward.available ? 'Unavailable' : 
                     !canAfford ? 'Not Enough Gems' : 'Claim'}
                  </ClaimButton>
                </RewardFooter>
              </RewardCard>
            );
          })}
        </RewardsGrid>
      </motion.div>
    </RewardsContainer>
  );
};
