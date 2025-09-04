import styled, { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.sm}; /* Mobile-first: start with smaller font */
    line-height: 1.6;
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* Mobile-first responsive design - scale UP for larger screens */
  @media (min-width: ${theme.breakpoints.md}) {
    body {
      font-size: ${theme.typography.fontSize.base};
    }
  }

  /* Remove default button styles */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Remove default input styles */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
  }

  /* Remove default list styles */
  ul, ol {
    list-style: none;
  }

  /* Remove default link styles */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Ensure images are responsive */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: ${theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.tertiary};
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  /* Safe area insets for mobile devices */
  @supports (padding: max(0px)) {
    body {
      padding-left: max(0px, env(safe-area-inset-left));
      padding-right: max(0px, env(safe-area-inset-right));
    }
  }

  /* Prevent horizontal scrolling */
  html, body {
    overflow-x: hidden;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Loading animation */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Utility classes */
  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .bounce {
    animation: bounce 1s infinite;
  }

  .spin {
    animation: spin 1s linear infinite;
  }
`;

// Common styled components
export const Container = styled.div`
  width: 100%;
  max-width: 428px; /* iPhone 14 Pro Max width */
  margin: 0 auto;
  padding: 0 ${theme.spacing.sm}; /* Mobile-first: start with smaller padding */
  
  @media (min-width: ${theme.breakpoints.md}) {
    max-width: 480px;
    padding: 0 ${theme.spacing.md}; /* Scale up padding for larger screens */
  }
`;

export const Card = styled.div<{ padding?: string; shadow?: boolean }>`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.xl};
  padding: ${props => props.padding || theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  ${props => props.shadow && `box-shadow: ${theme.shadows.md};`}
  
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: ${theme.colors.surface};
  }
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.lg};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
  
  ${props => props.fullWidth && 'width: 100%;'}
  
  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
          min-height: 36px;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          min-height: 56px;
        `;
      default:
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          min-height: 44px;
        `;
    }
  }}
  
  /* Color variants */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${theme.colors.gradients.primary};
          color: ${theme.colors.text.inverse};
          box-shadow: ${theme.shadows.sm};
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.surface};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          
          &:hover {
            background: ${theme.colors.surfaceHover};
            border-color: ${theme.colors.primary};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          
          &:hover {
            background: ${theme.colors.primary};
            color: ${theme.colors.text.inverse};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.text.secondary};
          
          &:hover {
            background: ${theme.colors.surface};
            color: ${theme.colors.text.primary};
          }
        `;
      default:
        return `
          background: ${theme.colors.gradients.primary};
          color: ${theme.colors.text.inverse};
          box-shadow: ${theme.shadows.sm};
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;
