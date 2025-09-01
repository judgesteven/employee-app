import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gem, ChevronRight } from 'lucide-react';
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

const StepsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.md};
`;

const StepsInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const StepsCount = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: 1;
`;

const StepsLabel = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  opacity: 0.8;
`;

const ViewMoreButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: ${theme.colors.text.inverse};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  backdrop-filter: blur(10px);
  
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
        
        <StepsSection>
          <StepsInfo>
            <StepsCount>{formatStepCount(user.dailyStepCount)}</StepsCount>
            <StepsLabel>steps today</StepsLabel>
          </StepsInfo>
          
          <ViewMoreButton
            onClick={onViewMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Profile
            <ChevronRight size={16} />
          </ViewMoreButton>
        </StepsSection>
      </HeaderContent>
    </HeaderContainer>
  );
};
