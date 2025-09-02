import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gem, Clock } from 'lucide-react';
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
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.$available ? 1 : 0.6};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const RewardHeroImage = styled.div<{ $heroImage?: string }>`
  width: 100%;
  height: 200px;
  background: ${props => props.$heroImage 
    ? `url("${props.$heroImage}") center/cover` 
    : 'linear-gradient(135deg, #f0f0f0, #e0e0e0)'};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize['4xl']};
`;

const BrandBadge = styled.div<{ $brandColor?: string }>`
  position: absolute;
  top: ${theme.spacing.md};
  left: ${theme.spacing.md};
  background: ${props => props.$brandColor || theme.colors.primary};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GemCostBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CountdownBadge = styled.div`
  background: linear-gradient(135deg, #ff6b35, #ff8c42);
  color: white;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin: ${theme.spacing.md} ${theme.spacing.md} 0;
  width: fit-content;
`;

const RewardContent = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.lg};
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

const AvailabilityText = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.md};
`;

const ClaimButton = styled(Button)<{ $canAfford: boolean }>`
  width: 100%;
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  background: ${theme.colors.primary};
  
  &:hover {
    background: ${theme.colors.primary}dd;
  }
  
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
      name: 'Large Prize',
      description: 'This is a Large Prize - these are very rare',
      cost: 1000,
      image: '🎮',
      category: 'entertainment',
      available: true,
      claimed: false,
      brand: 'NINTENDO',
      brandColor: '#e60012',
      heroImage: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=200&fit=crop',
      availableCount: 5,
      expiresAt: new Date(Date.now() + 121 * 24 * 60 * 60 * 1000),
      rarity: 'large'
    },
    {
      id: '2',
      name: 'Medium Prize',
      description: 'This is a Medium Prize - there are less of these',
      cost: 500,
      image: '🧱',
      category: 'entertainment',
      available: true,
      claimed: false,
      brand: 'LEGO',
      brandColor: '#ffcf00',
      heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
      availableCount: 100,
      expiresAt: new Date(Date.now() + 121 * 24 * 60 * 60 * 1000),
      rarity: 'medium'
    },
    {
      id: '3',
      name: 'Refreshing Prize',
      description: 'This prize refreshes stock monthly',
      cost: 250,
      image: '☕',
      category: 'food',
      available: true,
      claimed: false,
      brand: 'STARBUCKS',
      brandColor: '#00704a',
      heroImage: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=200&fit=crop',
      availableCount: 100,
      expiresAt: new Date(Date.now() + 121 * 24 * 60 * 60 * 1000),
      rarity: 'refreshing'
    },
    {
      id: '4',
      name: 'Small Prize',
      description: 'This is a Small Prize - there are many of these',
      cost: 100,
      image: '🎬',
      category: 'entertainment',
      available: true,
      claimed: false,
      brand: 'DISNEY',
      brandColor: '#0066cc',
      heroImage: 'https://images.unsplash.com/photo-1489599162436-ba8bf4a8e7e2?w=400&h=200&fit=crop',
      availableCount: 1000,
      expiresAt: new Date(Date.now() + 121 * 24 * 60 * 60 * 1000),
      rarity: 'small'
    },
    {
      id: '5',
      name: 'Fitness Tracker',
      description: 'Latest fitness tracking wearable device',
      cost: 800,
      image: '⌚',
      category: 'fitness',
      available: true,
      claimed: false,
      brand: 'APPLE',
      brandColor: '#007aff',
      heroImage: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=200&fit=crop',
      availableCount: 25,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      rarity: 'medium'
    },
    {
      id: '6',
      name: 'Gaming Console',
      description: 'Next-gen gaming console with controller',
      cost: 1500,
      image: '🎮',
      category: 'entertainment',
      available: false, // Out of stock
      claimed: false,
      brand: 'SONY',
      brandColor: '#003791',
      heroImage: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=200&fit=crop',
      availableCount: 0,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      rarity: 'large'
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

  const calculateDaysLeft = (expiresAt?: Date): number => {
    if (!expiresAt) return 0;
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const handleClaimReward = (rewardId: string, cost: number) => {
    if (userGems >= cost) {
      setUserGems(prev => prev - cost);
      setRewards(prev => prev.map(reward => 
        reward.id === rewardId ? { ...reward, claimed: true } : reward
      ));
      // In production, this would call GameLayer API to claim the reward
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
            const daysLeft = calculateDaysLeft(reward.expiresAt);
            
            return (
              <RewardCard
                key={reward.id}
                variants={itemVariants}
                whileHover={{ scale: reward.available ? 1.02 : 1 }}
                $available={reward.available && !reward.claimed}
              >
                <RewardHeroImage $heroImage={reward.heroImage}>
                  {reward.brand && (
                    <BrandBadge $brandColor={reward.brandColor}>
                      {reward.brand}
                    </BrandBadge>
                  )}
                  
                  <GemCostBadge>
                    <Gem size={14} />
                    -{reward.cost}
                  </GemCostBadge>
                  
                  {!reward.heroImage && reward.image}
                </RewardHeroImage>

                {daysLeft > 0 && (
                  <CountdownBadge>
                    <Clock size={16} />
                    {daysLeft} days left
                  </CountdownBadge>
                )}

                <RewardContent>
                  <RewardInfo>
                    <RewardName>{reward.name}</RewardName>
                    <RewardDescription>{reward.description}</RewardDescription>
                  </RewardInfo>
                  
                  {reward.availableCount !== undefined && (
                    <AvailabilityText>
                      Available: {reward.availableCount}
                    </AvailabilityText>
                  )}
                  
                  <ClaimButton
                    variant="primary"
                    disabled={!canClaim}
                    $canAfford={canAfford}
                    onClick={() => canClaim && handleClaimReward(reward.id, reward.cost)}
                  >
                    {reward.claimed ? 'Claimed' : 
                     !reward.available ? 'Out of Stock' : 
                     !canAfford ? 'Not Enough Gems' : 'Get Prize'}
                  </ClaimButton>
                </RewardContent>

                {!reward.available && <UnavailableBadge>Out of Stock</UnavailableBadge>}
                {reward.claimed && <ClaimedBadge>Claimed</ClaimedBadge>}
              </RewardCard>
            );
          })}
        </RewardsGrid>
      </motion.div>
    </RewardsContainer>
  );
};
