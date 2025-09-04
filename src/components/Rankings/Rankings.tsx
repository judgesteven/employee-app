import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Users, TrendingUp, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
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

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xs};
  background: ${theme.colors.surfaceHover};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.primary};
    color: white;
    transform: rotate(90deg);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
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

const PeriodBadge = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
  margin-bottom: -12px; /* Negative margin to overlap the first card by 50% */
  
  span {
    padding: 4px 8px;
    border-radius: ${theme.borderRadius.full};
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.medium};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: ${theme.colors.primary};
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const RankingsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const RankingRow = styled(motion.div)<{ $rank: number; $isCurrentPlayer: boolean }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => {
    if (props.$isCurrentPlayer) {
      // Yellow highlight for current player/team
      return 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.08) 100%)';
    } else {
      // Same color for all other rankings
      return theme.colors.surfaceHover;
    }
  }};
  border: ${props => {
    if (props.$isCurrentPlayer) {
      return '1px solid rgba(255, 215, 0, 0.3)'; // Yellow border for current player
    } else {
      return '1px solid transparent'; // No border for others
    }
  }};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RankNumber = styled.div<{ $rank: number; $isCurrentPlayer: boolean }>`
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.base};
  margin-right: ${theme.spacing.md};
  color: ${props => {
    if (props.$isCurrentPlayer) {
      return '#B8860B'; // Dark gold for current player
    } else {
      return theme.colors.text.secondary; // Same color for all others
    }
  }};
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
  border-radius: ${theme.borderRadius.lg};
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

const ShowMoreButton = styled(motion.button)`
  width: 100%;
  padding: ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
  background: ${theme.colors.surfaceHover};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  
  &:hover {
    background: ${theme.colors.primary};
    color: white;
    border-color: ${theme.colors.primary};
  }
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
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<{id: string, teamId?: string} | null>(null);

  // Fetch individual leaderboard data
  const fetchLeaderboardData = useCallback(async (leaderboardId: 'pvp' | 'tvt') => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Fetching fresh ${leaderboardId.toUpperCase()} data from GameLayer...`);
      const response = await gameLayerApi.getLeaderboard(leaderboardId);
      
      // Ensure we always have arrays
      const data = Array.isArray(response) ? response : [];
      
      if (leaderboardId === 'pvp') {
        setPvpData(data);
      } else {
        setTvtData(data);
      }
      
      console.log(`✅ Updated ${leaderboardId.toUpperCase()} data: ${data.length} entries`);
    } catch (err) {
      console.error(`Error fetching ${leaderboardId} leaderboard:`, err);
      setError(`Failed to load ${leaderboardId.toUpperCase()} leaderboard data`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current player info for highlighting
  useEffect(() => {
    const fetchCurrentPlayer = async () => {
      try {
        const playerData = await gameLayerApi.getPlayer();
        setCurrentPlayer({
          id: playerData.id,
          teamId: playerData.team
        });
      } catch (error) {
        console.warn('Could not fetch current player info for ranking highlight:', error);
      }
    };

    fetchCurrentPlayer();
  }, []);

  // Initial load - fetch current tab data
  useEffect(() => {
    fetchLeaderboardData(activeTab);
  }, [activeTab, fetchLeaderboardData]); // Depend on activeTab and the memoized function

  // Handle tab change with fresh data fetch
  const handleTabChange = (tab: 'pvp' | 'tvt') => {
    setActiveTab(tab);
    setShowAllEntries(false); // Reset to collapsed view when switching tabs
    // Always fetch fresh data when switching tabs
    fetchLeaderboardData(tab);
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
        
        <HeaderControls>
          <RefreshButton 
            onClick={() => fetchLeaderboardData(activeTab)}
            disabled={loading}
            title="Refresh leaderboard data"
          >
            <RefreshCw size={16} />
          </RefreshButton>
          
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
        </HeaderControls>
      </RankingsHeader>

      <PeriodBadge>
        <span>
          {activeTab === 'pvp' ? 'Weekly' : 'Monthly'}
        </span>
      </PeriodBadge>

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
          <>
            {(activeTab === 'pvp' ? pvpData : tvtData)
              .filter(Boolean)
              .slice(0, showAllEntries ? undefined : 5) // Show first 5 entries unless expanded
              .map((entry, index) => {
                // Determine if this is a player or team entry
                const isPlayer = !!entry.player;
                const name = isPlayer ? entry.player!.name : entry.team!.name;
                const avatar = isPlayer ? entry.player!.imgUrl : entry.team!.imgUrl;
                const id = isPlayer ? entry.player!.id : entry.team!.id;
                
                // Check if this is the current player's ranking
                const isCurrentPlayerEntry = currentPlayer && (
                  (activeTab === 'pvp' && isPlayer && entry.player!.id === currentPlayer.id) ||
                  (activeTab === 'tvt' && !isPlayer && entry.team!.id === currentPlayer.teamId)
                );
                
                return (
                  <RankingRow
                    key={id}
                    $rank={entry.rank || index + 1}
                    $isCurrentPlayer={!!isCurrentPlayerEntry}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <RankNumber 
                      $rank={entry.rank || index + 1}
                      $isCurrentPlayer={!!isCurrentPlayerEntry}
                    >
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
              })}
            
            {/* Show More/Less Button */}
            {(activeTab === 'pvp' ? pvpData : tvtData).length > 5 && (
              <ShowMoreButton
                onClick={() => setShowAllEntries(!showAllEntries)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {showAllEntries ? (
                  <>
                    <ChevronUp size={16} />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Show More ({(activeTab === 'pvp' ? pvpData : tvtData).length - 5} more)
                  </>
                )}
              </ShowMoreButton>
            )}
          </>
        )}
      </RankingsTable>
    </RankingsContainer>
  );
};
