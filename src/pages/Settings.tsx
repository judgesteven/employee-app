import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';
import { StepTracker } from '../components/HealthTracking/StepTracker';
import { HealthProviderToggle } from '../components/HealthTracking/HealthProviderToggle';
import { GoogleFitConnection } from '../components/HealthTracking/GoogleFitConnection';

const SettingsContainer = styled(Container)`
  padding-top: ${theme.spacing.lg};
  padding-bottom: calc(80px + ${theme.spacing.lg});
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(248, 250, 252, 1) 0%, rgba(241, 245, 249, 1) 100%);
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
          <motion.div variants={itemVariants}>
            <GoogleFitConnection onStatusChange={(status) => {
              console.log('Google Fit status changed:', status);
            }} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <HealthProviderToggle onProviderChange={(provider) => {
              console.log(`Settings: Health provider changed to ${provider}`);
            }} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StepTracker onStepTracked={(stepCount) => {
              console.log(`Settings: ${stepCount} steps tracked to GameLayer`);
            }} />
          </motion.div>
        </Section>
      </motion.div>
    </SettingsContainer>
  );
};
