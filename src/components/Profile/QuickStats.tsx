import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Achievement } from '../../types';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const StatCard = styled(motion.div)`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  transition: all 0.3s ease;
`;

const StatIcon = styled.div`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

interface QuickStatsProps {
  dailySteps: number;
  weeklySteps: number;
  monthlySteps: number;
  recentAchievements: Achievement[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  dailySteps,
  weeklySteps,
  monthlySteps,
}) => {
  const formatNumber = (num: number): string => 
    num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` :
    num >= 1000 ? `${(num / 1000).toFixed(1)}k` : 
    num.toLocaleString();

  const variants = {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    }
  };

  return (
    <motion.div
      variants={variants.container}
      initial="hidden"
      animate="visible"
    >
      {(weeklySteps > 0 || monthlySteps > 0) && (
        <StatsGrid>
          {weeklySteps > 0 && (
            <StatCard variants={variants.item} whileHover={{ scale: 1.02 }}>
              <StatIcon>
                <Calendar size={24} />
              </StatIcon>
              <StatValue>{formatNumber(weeklySteps)}</StatValue>
              <StatLabel>This Week</StatLabel>
            </StatCard>
          )}
          
          {monthlySteps > 0 && (
            <StatCard variants={variants.item} whileHover={{ scale: 1.02 }}>
              <StatIcon>
                <TrendingUp size={24} />
              </StatIcon>
              <StatValue>{formatNumber(monthlySteps)}</StatValue>
              <StatLabel>This Month</StatLabel>
            </StatCard>
          )}
        </StatsGrid>
      )}
    </motion.div>
  );
};