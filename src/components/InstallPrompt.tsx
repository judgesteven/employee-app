import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Download, X } from 'lucide-react';
import { theme } from '../styles/theme';

const InstallBanner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  box-shadow: ${theme.shadows.md};
`;

const InstallContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex: 1;
`;

const InstallText = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const InstallButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);
    
    // For iOS, show manual install instructions
    if (iOS && !standalone) {
      // Show iOS install prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('📱 PWA install prompt available');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    console.log('📱 Showing install prompt');
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`📱 User choice: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <InstallBanner>
      <InstallContent>
        <Download size={20} />
        <InstallText>
          {isIOS 
            ? 'Add to Home Screen: Tap Share → Add to Home Screen' 
            : 'Install Employee Step-Up for quick access!'
          }
        </InstallText>
      </InstallContent>
      <div style={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
        {!isIOS && (
          <InstallButton onClick={handleInstall}>
            <Download size={16} />
            Install
          </InstallButton>
        )}
        <CloseButton onClick={handleClose}>
          <X size={16} />
        </CloseButton>
      </div>
    </InstallBanner>
  );
};
