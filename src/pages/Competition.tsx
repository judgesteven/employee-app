import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { Container } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { LeaderboardEntry } from '../types';

const CompetitionContainer = styled(Container)`
  padding-top: ${theme.spacing.lg};
  padding-bottom: calc(80px + ${theme.spacing.lg});
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.base};
`;

const LeaderboardTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
`;

const LeaderboardTab = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$isActive ? theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? theme.colors.text.inverse : theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: ${props => props.$isActive ? theme.colors.primary : theme.colors.surfaceHover};
    color: ${props => props.$isActive ? theme.colors.text.inverse : theme.colors.text.primary};
  }
`;

const TopThree = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
`;

const TopPlayer = styled(motion.div)<{ $rank: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  ${props => {
    if (props.$rank === 1) {
      return `
        order: 2;
        transform: translateY(-${theme.spacing.md});
      `;
    } else if (props.$rank === 2) {
      return `order: 1;`;
    } else {
      return `order: 3;`;
    }
  }}
`;

const PlayerAvatar = styled.img<{ $rank: number }>`
  width: ${props => props.$rank === 1 ? '80px' : '64px'};
  height: ${props => props.$rank === 1 ? '80px' : '64px'};
  border-radius: ${theme.borderRadius.full};
  border: ${props => {
    if (props.$rank === 1) return `4px solid ${theme.colors.accent}`;
    if (props.$rank === 2) return `3px solid #C0C0C0`;
    return `3px solid #CD7F32`;
  }};
  object-fit: cover;
`;

const PlayerName = styled.div<{ $rank: number }>`
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${props => props.$rank === 1 ? theme.typography.fontSize.lg : theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  text-align: center;
`;

const PlayerScore = styled.div<{ $rank: number }>`
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${props => props.$rank === 1 ? theme.typography.fontSize.xl : theme.typography.fontSize.lg};
  color: ${theme.colors.primary};
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
  color: ${theme.colors.text.inverse};
  margin-bottom: ${theme.spacing.xs};
  
  background: ${props => {
    if (props.$rank === 1) return theme.colors.accent;
    if (props.$rank === 2) return '#C0C0C0';
    return '#CD7F32';
  }};
`;

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const LeaderboardItem = styled(motion.div)<{ $isCurrentUser?: boolean }>`
  background: ${props => props.$isCurrentUser ? theme.colors.primary + '10' : theme.colors.background};
  border: 1px solid ${props => props.$isCurrentUser ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  
  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const ItemRank = styled.div<{ $rank: number }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.sm};
  
  ${props => {
    if (props.$rank <= 3) {
      const color = props.$rank === 1 ? theme.colors.accent : 
                   props.$rank === 2 ? '#C0C0C0' : '#CD7F32';
      return `
        background: ${color};
        color: ${theme.colors.text.inverse};
      `;
    } else {
      return `
        background: ${theme.colors.surface};
        color: ${theme.colors.text.secondary};
      `;
    }
  }}
`;

const ItemAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const ItemName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const ItemScore = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.primary};
`;

const ItemChange = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  color: ${props => props.$positive ? theme.colors.success : theme.colors.error};
`;

type LeaderboardType = 'daily' | 'weekly' | 'monthly' | 'allTime';

export const Competition: React.FC = () => {
  const [leaderboards, setLeaderboards] = useState<Record<LeaderboardType, LeaderboardEntry[]>>({
    daily: [],
    weekly: [],
    monthly: [],
    allTime: [],
  });
  const [activeTab, setActiveTab] = useState<LeaderboardType>('weekly');
  const [loading, setLoading] = useState(true);

  // Mock leaderboard data - in production this would come from GameLayer API
  const mockLeaderboardData: Record<LeaderboardType, LeaderboardEntry[]> = {
    daily: [
      {
        userId: '1',
        username: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        score: 12847,
        rank: 1,
      },
      {
        userId: '2',
        username: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e5a1b3?w=150&h=150&fit=crop&crop=face',
        score: 11293,
        rank: 2,
      },
      {
        userId: '3',
        username: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        score: 10856,
        rank: 3,
      },
      {
        userId: '4',
        username: 'Emily Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        score: 9742,
        rank: 4,
      },
      {
        userId: '5',
        username: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        score: 9234,
        rank: 5,
      },
    ],
    weekly: [
      {
        userId: '2',
        username: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e5a1b3?w=150&h=150&fit=crop&crop=face',
        score: 78432,
        rank: 1,
      },
      {
        userId: '1',
        username: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        score: 76891,
        rank: 2,
      },
      {
        userId: '4',
        username: 'Emily Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        score: 72156,
        rank: 3,
      },
      {
        userId: '3',
        username: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        score: 69823,
        rank: 4,
      },
      {
        userId: '5',
        username: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        score: 65437,
        rank: 5,
      },
    ],
    monthly: [
      {
        userId: '4',
        username: 'Emily Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        score: 298765,
        rank: 1,
      },
      {
        userId: '1',
        username: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        score: 287432,
        rank: 2,
      },
      {
        userId: '2',
        username: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e5a1b3?w=150&h=150&fit=crop&crop=face',
        score: 276891,
        rank: 3,
      },
      {
        userId: '5',
        username: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        score: 265234,
        rank: 4,
      },
      {
        userId: '3',
        username: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        score: 254876,
        rank: 5,
      },
    ],
    allTime: [
      {
        userId: '1',
        username: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        score: 2847392,
        rank: 1,
      },
      {
        userId: '4',
        username: 'Emily Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        score: 2654321,
        rank: 2,
      },
      {
        userId: '2',
        username: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e5a1b3?w=150&h=150&fit=crop&crop=face',
        score: 2432187,
        rank: 3,
      },
      {
        userId: '5',
        username: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        score: 2198765,
        rank: 4,
      },
      {
        userId: '3',
        username: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        score: 1987654,
        rank: 5,
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLeaderboards(mockLeaderboardData);
      setLoading(false);
    }, 1000);
  }, []); // mockLeaderboardData is static data, no need to include in dependencies

  const currentLeaderboard = leaderboards[activeTab];
  const topThree = currentLeaderboard.slice(0, 3);
  const remaining = currentLeaderboard.slice(3);

  const formatScore = (score: number): string => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    }
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toLocaleString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (loading) {
    return (
      <CompetitionContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: `3px solid ${theme.colors.border}`, borderTop: `3px solid ${theme.colors.primary}`, borderRadius: '50%' }} />
        </div>
      </CompetitionContainer>
    );
  }

  return (
    <CompetitionContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header>
          <Title>Rankings</Title>
          <Subtitle>See how you stack up against other players</Subtitle>
        </Header>

        <LeaderboardTabs>
          <LeaderboardTab
            $isActive={activeTab === 'daily'}
            onClick={() => setActiveTab('daily')}
          >
            Daily
          </LeaderboardTab>
          <LeaderboardTab
            $isActive={activeTab === 'weekly'}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly
          </LeaderboardTab>
          <LeaderboardTab
            $isActive={activeTab === 'monthly'}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly
          </LeaderboardTab>
          <LeaderboardTab
            $isActive={activeTab === 'allTime'}
            onClick={() => setActiveTab('allTime')}
          >
            All Time
          </LeaderboardTab>
        </LeaderboardTabs>

        {topThree.length > 0 && (
          <TopThree>
            {topThree.map((player) => (
              <TopPlayer
                key={player.userId}
                $rank={player.rank}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <RankBadge $rank={player.rank}>
                  {player.rank === 1 ? <Crown size={16} /> : player.rank}
                </RankBadge>
                <PlayerAvatar
                  src={player.avatar}
                  alt={player.username}
                  $rank={player.rank}
                />
                <PlayerName $rank={player.rank}>{player.username}</PlayerName>
                <PlayerScore $rank={player.rank}>
                  {formatScore(player.score)}
                </PlayerScore>
              </TopPlayer>
            ))}
          </TopThree>
        )}

        <LeaderboardList>
          {remaining.map((player, index) => (
            <LeaderboardItem
              key={player.userId}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              $isCurrentUser={player.userId === '1'} // Assuming current user ID is '1'
            >
              <ItemRank $rank={player.rank}>
                {player.rank <= 3 ? (
                  player.rank === 1 ? <Crown size={16} /> :
                  player.rank === 2 ? <Medal size={16} /> :
                  <Trophy size={16} />
                ) : (
                  player.rank
                )}
              </ItemRank>
              
              <ItemAvatar src={player.avatar} alt={player.username} />
              
              <ItemInfo>
                <ItemName>{player.username}</ItemName>
                <ItemScore>{formatScore(player.score)}</ItemScore>
              </ItemInfo>
              
              <ItemChange $positive={Math.random() > 0.5}>
                <TrendingUp size={16} />
                <span>+{Math.floor(Math.random() * 5) + 1}</span>
              </ItemChange>
            </LeaderboardItem>
          ))}
        </LeaderboardList>
      </motion.div>
    </CompetitionContainer>
  );
};
