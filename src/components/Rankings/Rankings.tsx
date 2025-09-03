import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { theme } from '../../styles/theme';

const RankingsContainer = styled(motion.div)`
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

const RankingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const RankingsTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const RankingsIcon = styled.div`
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
`;

const TabsContainer = styled.div`
  display: flex;
  background: ${theme.colors.surfaceHover};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xs};
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  
  ${props => props.$active ? `
    background: ${theme.colors.primary};
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  ` : `
    background: transparent;
    color: ${theme.colors.text.secondary};
    
    &:hover {
      color: ${theme.colors.text.primary};
      background: rgba(255, 255, 255, 0.5);
    }
  `}
`;

const RankingsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const RankingRow = styled(motion.div)<{ $rank: number }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$rank <= 3 ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)' : theme.colors.surfaceHover};
  border: ${props => props.$rank <= 3 ? '1px solid rgba(255, 215, 0, 0.2)' : '1px solid transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RankBadge = styled.div<{ $rank: number }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.sm};
  margin-right: ${theme.spacing.md};
  
  ${props => {
    if (props.$rank === 1) return `
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      color: white;
    `;
    if (props.$rank === 2) return `
      background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
      color: white;
    `;
    if (props.$rank === 3) return `
      background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%);
      color: white;
    `;
    return `
      background: ${theme.colors.surface};
      color: ${theme.colors.text.secondary};
    `;
  }}
`;

const PlayerInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
`;

const PlayerDetails = styled.div`
  flex: 1;
`;

const PlayerName = styled.div`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const ScoreInfo = styled.div`
  text-align: right;
`;

const Score = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

interface Player {
  id: string;
  name: string;
  avatar: string;
  team: string;
  score: number;
}

interface Team {
  id: string;
  name: string;
  score: number;
  memberCount: number;
}

interface RankingsProps {}

const mockPvPData: Player[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    team: 'Marketing Team',
    score: 15420
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    team: 'Engineering',
    score: 14890
  },
  {
    id: '3',
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    team: 'Design Team',
    score: 14250
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    team: 'Sales',
    score: 13780
  },
  {
    id: '5',
    name: 'Lisa Wong',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    team: 'HR',
    score: 13420
  }
];

const mockTvTData: Team[] = [
  {
    id: '1',
    name: 'Engineering',
    score: 45620,
    memberCount: 12
  },
  {
    id: '2',
    name: 'Marketing Team',
    score: 42890,
    memberCount: 8
  },
  {
    id: '3',
    name: 'Design Team',
    score: 38750,
    memberCount: 6
  },
  {
    id: '4',
    name: 'Sales',
    score: 35280,
    memberCount: 10
  },
  {
    id: '5',
    name: 'HR',
    score: 28420,
    memberCount: 5
  }
];

export const Rankings: React.FC<RankingsProps> = () => {
  const [activeTab, setActiveTab] = useState<'pvp' | 'tvt'>('pvp');

  return (
    <RankingsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <RankingsHeader>
        <TitleSection>
          <RankingsIcon>
            <TrendingUp size={24} />
          </RankingsIcon>
          <RankingsTitle>Rankings</RankingsTitle>
        </TitleSection>
        
        <TabsContainer>
          <Tab 
            $active={activeTab === 'pvp'} 
            onClick={() => setActiveTab('pvp')}
          >
            <Users size={16} />
            PvP
          </Tab>
          <Tab 
            $active={activeTab === 'tvt'} 
            onClick={() => setActiveTab('tvt')}
          >
            <Users size={16} />
            TvT
          </Tab>
        </TabsContainer>
      </RankingsHeader>

      <RankingsTable>
        {activeTab === 'pvp' ? (
          mockPvPData.map((player, index) => (
            <RankingRow
              key={player.id}
              $rank={index + 1}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <RankBadge $rank={index + 1}>
                {index + 1}
              </RankBadge>
              
              <PlayerInfo>
                <Avatar src={player.avatar} alt={player.name} />
                <PlayerDetails>
                  <PlayerName>{player.name}</PlayerName>
                </PlayerDetails>
              </PlayerInfo>
              
              <ScoreInfo>
                <Score>{player.score.toLocaleString()}</Score>
              </ScoreInfo>
            </RankingRow>
          ))
        ) : (
          mockTvTData.map((team, index) => (
            <RankingRow
              key={team.id}
              $rank={index + 1}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <RankBadge $rank={index + 1}>
                {index + 1}
              </RankBadge>
              
              <PlayerInfo>
                <PlayerDetails>
                  <PlayerName>{team.name}</PlayerName>
                </PlayerDetails>
              </PlayerInfo>
              
              <ScoreInfo>
                <Score>{team.score.toLocaleString()}</Score>
              </ScoreInfo>
            </RankingRow>
          ))
        )}
      </RankingsTable>
    </RankingsContainer>
  );
};
