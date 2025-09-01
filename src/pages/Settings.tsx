import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { StepTracker } from '../components/HealthTracking/StepTracker';

const SettingsContainer = styled(Container)`
  padding-top: ${theme.spacing.lg};
  padding-bottom: calc(80px + ${theme.spacing.lg});
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const BackButton = styled(Button)`
  padding: ${theme.spacing.sm};
  min-height: auto;
  width: 44px;
  height: 44px;
  border-radius: ${theme.borderRadius.full};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const Settings: React.FC = () => {
  const navigate = useNavigate();

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

  return (
    <SettingsContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header>
          <BackButton variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Settings</Title>
        </Header>

        <Section>
          <SectionTitle>
            <SettingsIcon size={24} color={theme.colors.primary} />
            Health Integration
          </SectionTitle>
          
          <motion.div variants={itemVariants}>
            <StepTracker onStepTracked={(stepCount) => {
              console.log(`Settings: ${stepCount} steps tracked to GameLayer`);
            }} />
          </motion.div>
        </Section>

        {/* Future sections can be added here */}
        {/* 
        <Section>
          <SectionTitle>Account Settings</SectionTitle>
          // Account-related settings
        </Section>

        <Section>
          <SectionTitle>Notifications</SectionTitle>
          // Notification preferences
        </Section>

        <Section>
          <SectionTitle>Privacy</SectionTitle>
          // Privacy settings
        </Section>
        */}
      </motion.div>
    </SettingsContainer>
  );
};
