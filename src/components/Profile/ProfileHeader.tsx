import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gem, Footprints } from 'lucide-react';
import { theme } from '../../styles/theme';
import { User } from '../../types';



const HeaderContainer = styled(motion.div)`
  background: ${theme.colors.gradients.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
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
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: ${theme.borderRadius.full};
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25px;
`;

const UserName = styled.h1`
  font-size: 1.375rem;
  font-weight: ${theme.typography.fontWeight.bold};
  margin: 0;
  line-height: 1.2;
`;

const TeamName = styled.span`
  font-size: 1rem;
  opacity: 0.8;
  line-height: 1.2;
`;

const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-end;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: white;
  min-width: 100px;
  justify-content: flex-end;
`;

const StatIcon = styled.div`
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

const StatValue = styled.div`
  text-align: right;
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
              <TeamName>{user.team}</TeamName>
            </UserDetails>
          </UserInfo>
          <StatsSection>
            <StatItem>
              <StatValue>{formatStepCount(user.dailyStepCount)}</StatValue>
              <StatIcon><Footprints size={20} /></StatIcon>
            </StatItem>
            <StatItem>
              <StatValue>{user.gems.toLocaleString()}</StatValue>
              <StatIcon><Gem size={20} /></StatIcon>
            </StatItem>
          </StatsSection>
        </TopRow>
      </HeaderContent>
    </HeaderContainer>
  );
};
