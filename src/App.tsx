import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { BottomNavigation } from './components/Navigation/BottomNavigation';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { ProfileDetails } from './pages/ProfileDetails';
import { Challenges } from './pages/Challenges';
import { Competition } from './pages/Competition';
import { Rewards } from './pages/Rewards';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/details" element={<ProfileDetails />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/competition" element={<Competition />} />
            <Route path="/rewards" element={<Rewards />} />
          </Routes>
          <BottomNavigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;