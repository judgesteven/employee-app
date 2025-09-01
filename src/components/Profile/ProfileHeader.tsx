import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gem, ChevronRight, Footprints } from 'lucide-react';
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

const BadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const BadgeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const BadgeText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BadgeValue = styled.div`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  line-height: 1;
`;

const BadgeLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  opacity: 0.8;
  margin-top: 2px;
`;

const ViewMoreSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${theme.spacing.md};
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
        </TopRow>
        
        <BadgesContainer>
          <Badge>
            <BadgeIcon>
              <Footprints size={20} />
            </BadgeIcon>
            <BadgeText>
              <BadgeValue>{formatStepCount(user.dailyStepCount)}</BadgeValue>
              <BadgeLabel>steps today</BadgeLabel>
            </BadgeText>
          </Badge>
          
          <Badge>
            <BadgeIcon>
              <Gem size={20} />
            </BadgeIcon>
            <BadgeText>
              <BadgeValue>{user.gems.toLocaleString()}</BadgeValue>
              <BadgeLabel>gems</BadgeLabel>
            </BadgeText>
          </Badge>
        </BadgesContainer>
        
        <ViewMoreSection>
          <ViewMoreButton
            onClick={onViewMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Profile
            <ChevronRight size={16} />
          </ViewMoreButton>
        </ViewMoreSection>
      </HeaderContent>
    </HeaderContainer>
  );
};
