import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Smartphone, Activity, Check } from 'lucide-react';
import { theme } from '../../styles/theme';
import { unifiedHealthService, HealthProvider } from '../../services/unifiedHealthService';

const ToggleContainer = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
`;

const ToggleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const ToggleTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ToggleDescription = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.lg} 0;
  line-height: 1.5;
`;

const ProviderOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const ProviderOption = styled(motion.div)<{ $selected?: boolean; $available?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  border: 2px solid ${props => 
    props.$selected 
      ? theme.colors.primary 
      : props.$available 
        ? theme.colors.border 
        : theme.colors.border
  };
  background: ${props => 
    props.$selected 
      ? theme.colors.primary + '10' 
      : props.$available 
        ? theme.colors.surface 
        : theme.colors.surface + '50'
  };
  cursor: ${props => props.$available ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.$available ? 1 : 0.6};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$available ? theme.colors.primary : theme.colors.border};
    transform: ${props => props.$available ? 'translateY(-1px)' : 'none'};
  }
`;

const ProviderIcon = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.$selected ? theme.colors.primary : theme.colors.background};
  color: ${props => props.$selected ? theme.colors.text.inverse : theme.colors.text.secondary};
`;

const ProviderInfo = styled.div`
  flex: 1;
`;

const ProviderName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: 2px;
`;

const ProviderStatus = styled.div<{ $available?: boolean }>`
  font-size: ${theme.typography.fontSize.sm};
  color: ${props => props.$available ? theme.colors.success : theme.colors.text.secondary};
`;

const SelectionIndicator = styled.div<{ $visible?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.primary};
  color: ${theme.colors.text.inverse};
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.2s ease;
`;

interface HealthProviderToggleProps {
  onProviderChange?: (provider: HealthProvider) => void;
}

export const HealthProviderToggle: React.FC<HealthProviderToggleProps> = ({ onProviderChange }) => {
  const [currentProvider, setCurrentProvider] = useState<HealthProvider>('google_fit');
  const [availableProviders, setAvailableProviders] = useState<{ provider: HealthProvider; available: boolean; name: string }[]>([]);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    // Get initial state
    setCurrentProvider(unifiedHealthService.getCurrentProvider());
    setAvailableProviders(unifiedHealthService.getAvailableProviders());

    // Listen for provider changes
    const handleProviderChanged = (event: CustomEvent) => {
      setCurrentProvider(event.detail.provider);
      setIsChanging(false);
    };

    window.addEventListener('healthProviderChanged', handleProviderChanged as EventListener);

    return () => {
      window.removeEventListener('healthProviderChanged', handleProviderChanged as EventListener);
    };
  }, []);

  const handleProviderSelect = async (provider: HealthProvider) => {
    if (provider === currentProvider || isChanging) return;

    const providerData = availableProviders.find(p => p.provider === provider);
    if (!providerData?.available) return;

    setIsChanging(true);
    
    try {
      const success = await unifiedHealthService.setProvider(provider);
      if (success) {
        setCurrentProvider(provider);
        onProviderChange?.(provider);
      }
    } catch (error) {
      console.error('Error switching provider:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const getProviderIcon = (provider: HealthProvider) => {
    switch (provider) {
      case 'apple_health':
        return <Smartphone size={20} />;
      case 'google_fit':
        return <Activity size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const getProviderStatusText = (provider: HealthProvider, available: boolean) => {
    if (!available) {
      switch (provider) {
        case 'apple_health':
          return 'Not available (requires iOS device)';
        case 'google_fit':
          return 'Not available';
        default:
          return 'Not available';
      }
    }
    return 'Available';
  };

  return (
    <ToggleContainer>
      <ToggleHeader>
        <Activity color={theme.colors.primary} size={24} />
        <ToggleTitle>Health Data Source</ToggleTitle>
      </ToggleHeader>

      <ToggleDescription>
        Connect with Google Fit to automatically track your steps and sync with your fitness data.
      </ToggleDescription>

      <ProviderOptions>
        {availableProviders.map((providerData) => (
          <ProviderOption
            key={providerData.provider}
            $selected={providerData.provider === currentProvider}
            $available={providerData.available}
            onClick={() => handleProviderSelect(providerData.provider)}
            whileHover={providerData.available ? { scale: 1.02 } : {}}
            whileTap={providerData.available ? { scale: 0.98 } : {}}
          >
            <ProviderIcon $selected={providerData.provider === currentProvider}>
              {getProviderIcon(providerData.provider)}
            </ProviderIcon>
            
            <ProviderInfo>
              <ProviderName>{providerData.name}</ProviderName>
              <ProviderStatus $available={providerData.available}>
                {getProviderStatusText(providerData.provider, providerData.available)}
              </ProviderStatus>
            </ProviderInfo>

            <SelectionIndicator $visible={providerData.provider === currentProvider}>
              <Check size={14} />
            </SelectionIndicator>
          </ProviderOption>
        ))}
      </ProviderOptions>

      {isChanging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: theme.spacing.md,
            textAlign: 'center',
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary
          }}
        >
          Switching health provider...
        </motion.div>
      )}
    </ToggleContainer>
  );
};
