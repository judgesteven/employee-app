import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gift, Gem, Clock } from 'lucide-react';
import { theme } from '../../styles/theme';
import { gameLayerApi } from '../../services/gameLayerApi';

// Main card container
const RewardsCard = styled(motion.div)`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${theme.colors.border};
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  transition: all 0.3s ease;
`;

const RewardsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const RewardsTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const RewardsIcon = styled.div`
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
`;

const RewardsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const SectionTitle = styled.h4`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.md};
`;

const ItemCard = styled(motion.div)`
  background: ${theme.colors.surfaceHover};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${theme.colors.primary}20;
  }
`;


const ItemImageSection = styled.div`
  position: relative;
  height: 100px;
  overflow: hidden;
`;

const ItemImage = styled.div<{ $bgImage?: string }>`
  width: 100%;
  height: 100%;
  background: ${props => props.$bgImage ? 
    `linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${props.$bgImage})` :
    'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
  };
  background-size: cover;
  background-position: center;
  position: relative;
`;


const TagsOverlay = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  left: ${theme.spacing.sm};
  display: flex;
  gap: ${theme.spacing.xs};
`;

const TimeRemainingOverlay = styled.div`
  position: absolute;
  bottom: ${theme.spacing.md};
  right: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: ${theme.borderRadius.full};
  color: ${theme.colors.text.inverse};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const TagBadge = styled.div<{ $tag: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: lowercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.9);
  color: ${theme.colors.text.primary};
  backdrop-filter: blur(8px);
`;

const ItemContent = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
`;

const ItemDetails = styled.div`
  flex: 1;
`;


const ItemDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xs};
  margin: 0;
  line-height: 1.4;
`;


const StockProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  margin: ${theme.spacing.sm} 0;
`;

const StockProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`;

const StockProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${theme.colors.success};
  border-radius: ${theme.borderRadius.full};
  transition: width 0.3s ease;
`;

const StockInfo = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  text-align: right;
`;

const GetButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.xl};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  
  &:hover {
    background: ${theme.colors.primary}dd;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const GemBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: ${theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

interface TodaysRewardsProps {}

interface GameLayerRaffle {
  id: string;
  name: string;
  description?: string;
  imgUrl?: string;
  cost?: number;
  credits?: number;
  category?: string;
  isAvailable?: boolean;
  tags?: string[];
  drawTime?: string; // Use drawTime from API
  period?: string;
  stock?: {
    available: number;
    count: number;
    redeemed: number;
  };
  expiresAt?: string;
}

interface GameLayerPrize {
  id: string;
  name: string;
  description?: string;
  imgUrl?: string;
  cost?: number; // Add cost for type compatibility
  credits?: number;
  category?: string;
  isAvailable?: boolean;
  tags?: string[];
  period?: string; // 'daily' for refresh period
  stock?: {
    redeemed: number;
    available: number;
    count: number;
  };
  expiresAt?: string;
}

export const TodaysRewards: React.FC<TodaysRewardsProps> = () => {
  const [raffles, setRaffles] = useState<GameLayerRaffle[]>([]);
  const [prizes, setPrizes] = useState<GameLayerPrize[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        setLoading(true);
        
        // Fetch both raffles and prizes in parallel
        const [raffleData, prizeData] = await Promise.all([
          gameLayerApi.getRaffles(),
          gameLayerApi.getPrizes()
        ]);
        
        setRaffles(Array.isArray(raffleData) ? raffleData : []);
        
        // Filter out prizes with 'Raffle' category
        const filteredPrizes = Array.isArray(prizeData) 
          ? prizeData.filter(prize => prize.category?.toLowerCase() !== 'raffle')
          : [];
        setPrizes(filteredPrizes);
        
      } catch (error) {
        console.error('Error fetching rewards data:', error);
        setRaffles([]);
        setPrizes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRewardsData();
  }, []);

  const formatTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatRaffleTimeRemaining = (drawTime?: string) => {
    if (!drawTime) return null;
    
    const now = new Date();
    const draw = new Date(drawTime);
    const diff = draw.getTime() - now.getTime();
    
    if (diff <= 0) return 'Draw ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDailyTimeRemaining = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Next midnight
    
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };


  const isRaffle = (item: GameLayerRaffle | GameLayerPrize): item is GameLayerRaffle => {
    return 'drawTime' in item;
  };

  const renderItemCard = (item: GameLayerRaffle | GameLayerPrize, index: number, type: 'raffle' | 'prize') => (
    <ItemCard
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <ItemImageSection>
        <ItemImage $bgImage={item.imgUrl}>
          {item.category && (
            <TagsOverlay>
              <TagBadge $tag={item.category}>
                {item.category}
              </TagBadge>
            </TagsOverlay>
          )}
          {type === 'raffle' && isRaffle(item) && item.drawTime && (
            <TimeRemainingOverlay>
              <Clock size={14} />
              {formatRaffleTimeRemaining(item.drawTime)}
            </TimeRemainingOverlay>
          )}
          {type === 'prize' && !isRaffle(item) && item.period === 'daily' && (
            <TimeRemainingOverlay>
              <Clock size={14} />
              {formatDailyTimeRemaining()}
            </TimeRemainingOverlay>
          )}
          {type === 'prize' && !isRaffle(item) && item.expiresAt && item.period !== 'daily' && (
            <TimeRemainingOverlay>
              <Clock size={14} />
              {formatTimeRemaining(item.expiresAt)}
            </TimeRemainingOverlay>
          )}
        </ItemImage>
      </ItemImageSection>
      
      <ItemContent>
        <ItemInfo>
          <ItemDetails>
            {item.description && (
              <ItemDescription>{item.description}</ItemDescription>
            )}
            
            {/* Stock progress bar for prizes */}
            {type === 'prize' && !isRaffle(item) && item.stock && (
              <StockProgressContainer>
                <StockProgressBar>
                  <StockProgressFill 
                    $percentage={Math.max(0, Math.min(100, (item.stock.available / item.stock.count) * 100))} 
                  />
                </StockProgressBar>
                <StockInfo>
                  {item.stock.available} / {item.stock.count}
                </StockInfo>
              </StockProgressContainer>
            )}
          </ItemDetails>
        </ItemInfo>
        
        {/* GET/ENTER button */}
        <GetButton>
          {type === 'raffle' ? 'ENTER' : 'GET'}
          {item.credits && (
            <GemBadge>
              <Gem size={14} />
              {item.credits}
            </GemBadge>
          )}
        </GetButton>
      </ItemContent>
    </ItemCard>
  );

  if (loading) {
    return (
      <RewardsCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <RewardsHeader>
          <RewardsIcon>
            <Gift size={24} />
          </RewardsIcon>
          <RewardsTitle>Rewards</RewardsTitle>
        </RewardsHeader>
        <LoadingContainer>Loading rewards...</LoadingContainer>
      </RewardsCard>
    );
  }

  const hasRaffles = raffles.length > 0;
  const hasPrizes = prizes.length > 0;
  const hasAnyRewards = hasRaffles || hasPrizes;

  if (!hasAnyRewards) {
    return (
      <RewardsCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <RewardsHeader>
          <RewardsIcon>
            <Gift size={24} />
          </RewardsIcon>
          <RewardsTitle>Rewards</RewardsTitle>
        </RewardsHeader>
        <EmptyState>No rewards available at the moment.</EmptyState>
      </RewardsCard>
    );
  }

  return (
    <RewardsCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <RewardsHeader>
        <RewardsIcon>
          <Gift size={24} />
        </RewardsIcon>
        <RewardsTitle>Rewards</RewardsTitle>
      </RewardsHeader>

      <RewardsContent>
        {hasRaffles && (
          <div>
            <SectionTitle>
              {raffles[0]?.name || 'Raffles'}
            </SectionTitle>
            <ItemsList>
              {raffles.slice(0, 4).map((raffle, index) => renderItemCard(raffle, index, 'raffle'))}
            </ItemsList>
          </div>
        )}

        {hasPrizes && (
          <div>
            <SectionTitle>
              {prizes[0]?.name || 'Prizes'}
            </SectionTitle>
            <ItemsList>
              {prizes.slice(0, 4).map((prize, index) => renderItemCard(prize, index, 'prize'))}
            </ItemsList>
          </div>
        )}
      </RewardsContent>
    </RewardsCard>
  );
};