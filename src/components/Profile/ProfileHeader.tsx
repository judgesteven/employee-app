import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gem, Clock, Zap } from 'lucide-react';
import { theme } from '../../styles/theme';
import { User } from '../../types';

const HeaderContainer = styled(motion.div)`
  background: ${theme.colors.gradients.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.inverse};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
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
  justify-content: flex-start;
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
  gap: 3px;
`;

const UserName = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin: 0;
  line-height: 1.2;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const UserLevel = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  opacity: 0.8;
  line-height: 1.2;
`;





const StatsSection = styled.div`
  margin-top: ${theme.spacing.md};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${theme.spacing.xs};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  min-width: 0; /* Allow shrinking */
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0; /* Allow shrinking */
`;

const StatCount = styled.div`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
    <HeaderContainer 
      onClick={onViewMore}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <BackgroundPattern />
      <HeaderContent>
        <TopRow>
          <UserInfo>
            <Avatar src={user.avatar} alt={user.name} />
            <UserDetails>
              <UserName>{user.name}</UserName>
              <UserMeta>
                <UserLevel>Tier: {user.level}</UserLevel>
              </UserMeta>
            </UserDetails>
          </UserInfo>
        </TopRow>
        
        <StatsSection>
          <StatsGrid>
            <StatItem>
              <StatIcon>
                👟
              </StatIcon>
              <StatInfo>
                <StatCount>{formatStepCount(user.dailyStepCount)}</StatCount>
              </StatInfo>
            </StatItem>
            
            <StatItem>
              <StatIcon>
                <Clock size={16} />
              </StatIcon>
              <StatInfo>
                <StatCount>{user.dailyActiveMinutes}</StatCount>
              </StatInfo>
            </StatItem>
            
            <StatItem>
              <StatIcon>
                <Gem size={16} />
              </StatIcon>
              <StatInfo>
                <StatCount>{user.gems.toLocaleString()}</StatCount>
              </StatInfo>
            </StatItem>
            
            <StatItem>
              <StatIcon>
                <Zap size={16} />
              </StatIcon>
              <StatInfo>
                <StatCount>{user.xp.toLocaleString()}</StatCount>
              </StatInfo>
            </StatItem>
          </StatsGrid>
        </StatsSection>
      </HeaderContent>
    </HeaderContainer>
  );
};
