import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { theme } from '../../styles/theme';
import { gameLayerApi } from '../../services/gameLayerApi';

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

const RankNumber = styled.div`
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.base};
  margin-right: ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
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

interface LeaderboardEntry {
  player?: {
    id: string;
    name: string;
    imgUrl?: string;
  };
  team?: {
    id: string;
    name: string;
    imgUrl?: string;
  };
  score: number;
  rank: number;
}

interface RankingsProps {}

export const Rankings: React.FC<RankingsProps> = () => {
  const [activeTab, setActiveTab] = useState<'pvp' | 'tvt'>('pvp');
  const [pvpData, setPvpData] = useState<LeaderboardEntry[]>([]);
  const [tvtData, setTvtData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both leaderboards in parallel
        const [pvpResponse, tvtResponse] = await Promise.all([
          gameLayerApi.getLeaderboard('pvp'),
          gameLayerApi.getLeaderboard('tvt')
        ]);

        // Ensure we always have arrays
        setPvpData(Array.isArray(pvpResponse) ? pvpResponse : []);
        setTvtData(Array.isArray(tvtResponse) ? tvtResponse : []);
      } catch (err) {
        console.error('Error fetching leaderboards:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, []);

  const handleTabChange = (tab: 'pvp' | 'tvt') => {
    setActiveTab(tab);
  };

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
            onClick={() => handleTabChange('pvp')}
          >
            <Users size={16} />
            PvP
          </Tab>
          <Tab 
            $active={activeTab === 'tvt'} 
            onClick={() => handleTabChange('tvt')}
          >
            <Users size={16} />
            TvT
          </Tab>
        </TabsContainer>
      </RankingsHeader>

      <RankingsTable>
        {loading ? (
          <div style={{ textAlign: 'center', padding: theme.spacing.xl, color: theme.colors.text.secondary }}>
            Loading leaderboard data...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: theme.spacing.xl, color: theme.colors.error }}>
            {error}
          </div>
        ) : (
          (activeTab === 'pvp' ? pvpData : tvtData).filter(Boolean).map((entry, index) => {
            // Determine if this is a player or team entry
            const isPlayer = !!entry.player;
            const name = isPlayer ? entry.player!.name : entry.team!.name;
            const avatar = isPlayer ? entry.player!.imgUrl : entry.team!.imgUrl;
            const id = isPlayer ? entry.player!.id : entry.team!.id;
            
            return (
              <RankingRow
                key={id}
                $rank={entry.rank || index + 1}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <RankNumber>
                  {entry.rank || index + 1}
                </RankNumber>
                
                <PlayerInfo>
                  <Avatar 
                    src={avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'} 
                    alt={name} 
                  />
                  <PlayerDetails>
                    <PlayerName>{name}</PlayerName>
                  </PlayerDetails>
                </PlayerInfo>
                
                <ScoreInfo>
                  <Score>{entry.score.toLocaleString()}</Score>
                </ScoreInfo>
              </RankingRow>
            );
          })
        )}
      </RankingsTable>
    </RankingsContainer>
  );
};
