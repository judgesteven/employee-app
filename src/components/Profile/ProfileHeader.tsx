import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gem, Clock } from 'lucide-react';
import { theme } from '../../styles/theme';
import { User } from '../../types';

const HeaderContainer = styled.div`
  background: ${theme.colors.gradients.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.inverse};
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
  pointer-events: none;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.full};
  border: 3px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const UserName = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin: 0;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserLevel = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  opacity: 0.8;
`;

const UserTeam = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  opacity: 0.7;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const GemsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  backdrop-filter: blur(10px);
`;

const GemsCount = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.md};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  flex: 1;
  margin-right: ${theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatCount = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: 1;
`;

const StatLabel = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  opacity: 0.8;
`;

const ViewMoreButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: ${theme.colors.text.inverse};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  backdrop-filter: blur(10px);
  min-width: auto;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

interface ProfileHeaderProps {
  user: User;
  onViewMore: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onViewMore }) => {
  const formatStepCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toLocaleString();
  };

  return (
    <HeaderContainer>
      <BackgroundPattern />
      <HeaderContent>
        <TopRow>
          <UserInfo>
            <Avatar src={user.avatar} alt={user.name} />
            <UserDetails>
              <UserName>{user.name}</UserName>
              <UserMeta>
                <UserLevel>Level {user.level}</UserLevel>
                <UserTeam>{user.team}</UserTeam>
              </UserMeta>
            </UserDetails>
          </UserInfo>
          
          <GemsContainer>
            <Gem size={20} />
            <GemsCount>{user.gems}</GemsCount>
          </GemsContainer>
        </TopRow>
        
        <StatsSection>
          <StatsGrid>
            <StatItem>
              <StatIcon>
                👟
              </StatIcon>
              <StatInfo>
                <StatCount>{formatStepCount(user.dailyStepCount)}</StatCount>
                <StatLabel>steps today</StatLabel>
              </StatInfo>
            </StatItem>
            
            <StatItem>
              <StatIcon>
                <Clock size={16} />
              </StatIcon>
              <StatInfo>
                <StatCount>{user.dailyActiveMinutes}</StatCount>
                <StatLabel>active minutes</StatLabel>
              </StatInfo>
            </StatItem>
          </StatsGrid>
          
          <ViewMoreButton
            onClick={onViewMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Profile
          </ViewMoreButton>
        </StatsSection>
      </HeaderContent>
    </HeaderContainer>
  );
};
