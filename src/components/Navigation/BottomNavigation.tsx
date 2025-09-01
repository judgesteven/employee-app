import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Trophy, Target, Gift } from 'lucide-react';
import { theme } from '../../styles/theme';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 428px;
  background: ${theme.colors.background};
  border-top: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  padding-bottom: calc(${theme.spacing.sm} + env(safe-area-inset-bottom, 0));
  z-index: ${theme.zIndex.fixed};
  
  /* Backdrop blur effect */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
`;

const NavList = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const NavItem = styled.li<{ $isActive: boolean }>`
  flex: 1;
`;

const NavLink = styled.button<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.lg};
  transition: all 0.2s ease-in-out;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  
  color: ${props => props.$isActive ? theme.colors.primary : theme.colors.text.secondary};
  
  &:hover {
    background: ${theme.colors.surface};
    color: ${theme.colors.primary};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const NavIcon = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  
  svg {
    width: 24px;
    height: 24px;
    stroke-width: ${props => props.$isActive ? '2.5' : '2'};
  }
`;

const NavLabel = styled.span<{ $isActive: boolean }>`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${props => props.$isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  text-align: center;
`;

const navigationItems = [
  {
    path: '/',
    label: 'Home',
    icon: User,
  },
  {
    path: '/challenges',
    label: 'Challenges',
    icon: Target,
  },
  {
    path: '/competition',
    label: 'Rankings',
    icon: Trophy,
  },
  {
    path: '/rewards',
    label: 'Rewards',
    icon: Gift,
  },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <NavContainer>
      <NavList>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <NavItem key={item.path} $isActive={isActive}>
              <NavLink
                $isActive={isActive}
                onClick={() => handleNavigation(item.path)}
                aria-label={item.label}
              >
                <NavIcon $isActive={isActive}>
                  <IconComponent />
                </NavIcon>
                <NavLabel $isActive={isActive}>
                  {item.label}
                </NavLabel>
              </NavLink>
            </NavItem>
          );
        })}
      </NavList>
    </NavContainer>
  );
};
