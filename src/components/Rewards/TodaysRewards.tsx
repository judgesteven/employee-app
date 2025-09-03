import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gift, Star, Gem, Clock } from 'lucide-react';
import { theme } from '../../styles/theme';

const RewardsContainer = styled(motion.div)`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  transition: all 0.3s ease;
`;

const RewardsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const RewardsTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const RewardsIcon = styled.div`
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
`;

const RewardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const RewardItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surfaceHover};
  border: 1px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: ${theme.colors.primary}20;
  }
`;

const RewardIconContainer = styled.div<{ $type: 'daily' | 'achievement' | 'bonus' }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md};
  
  ${props => {
    switch (props.$type) {
      case 'daily':
        return `
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
        `;
      case 'achievement':
        return `
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          color: white;
        `;
      case 'bonus':
        return `
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
        `;
    }
  }}
`;

const RewardInfo = styled.div`
  flex: 1;
`;

const RewardName = styled.div`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: 2px;
`;

const RewardDescription = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xs};
`;

const RewardValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const RewardAmount = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const RewardStatus = styled.div<{ $claimed: boolean }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: auto;
  
  ${props => props.$claimed ? `
    background: ${theme.colors.success}20;
    color: ${theme.colors.success};
  ` : `
    background: ${theme.colors.primary}20;
    color: ${theme.colors.primary};
  `}
`;

const TimeRemaining = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing.xs};
`;

interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'achievement' | 'bonus';
  value: number;
  currency: 'gems' | 'xp';
  claimed: boolean;
  expiresAt?: Date;
}

interface TodaysRewardsProps {}

const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'Daily Login Bonus',
    description: 'Complete your daily check-in',
    type: 'daily',
    value: 50,
    currency: 'gems',
    claimed: false,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours from now
  },
  {
    id: '2',
    name: 'Step Goal Achievement',
    description: 'Reached 10,000 steps today',
    type: 'achievement',
    value: 100,
    currency: 'xp',
    claimed: true
  },
  {
    id: '3',
    name: 'Weekly Streak Bonus',
    description: '7 days in a row - amazing!',
    type: 'bonus',
    value: 200,
    currency: 'gems',
    claimed: false
  }
];

export const TodaysRewards: React.FC<TodaysRewardsProps> = () => {
  const getRewardIcon = (type: 'daily' | 'achievement' | 'bonus') => {
    switch (type) {
      case 'daily':
        return <Gift size={24} />;
      case 'achievement':
        return <Star size={24} />;
      case 'bonus':
        return <Gem size={24} />;
    }
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  return (
    <RewardsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <RewardsHeader>
        <RewardsIcon>
          <Gift size={24} />
        </RewardsIcon>
        <RewardsTitle>Today's Rewards</RewardsTitle>
      </RewardsHeader>

      <RewardsList>
        {mockRewards.map((reward, index) => (
          <RewardItem
            key={reward.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <RewardIconContainer $type={reward.type}>
              {getRewardIcon(reward.type)}
            </RewardIconContainer>
            
            <RewardInfo>
              <RewardName>{reward.name}</RewardName>
              <RewardDescription>{reward.description}</RewardDescription>
              <RewardValue>
                <RewardAmount>
                  +{reward.value} {reward.currency === 'gems' ? <Gem size={16} /> : '⚡'}
                </RewardAmount>
              </RewardValue>
              {reward.expiresAt && !reward.claimed && (
                <TimeRemaining>
                  <Clock size={12} />
                  {formatTimeRemaining(reward.expiresAt)}
                </TimeRemaining>
              )}
            </RewardInfo>
            
            <RewardStatus $claimed={reward.claimed}>
              {reward.claimed ? 'Claimed' : 'Available'}
            </RewardStatus>
          </RewardItem>
        ))}
      </RewardsList>
    </RewardsContainer>
  );
};
