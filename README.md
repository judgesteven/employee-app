# Employee Step-Up App 🏃‍♂️💎

A gamified fitness tracking mobile web application that encourages employees to stay active through challenges, rewards, and social competition.

## 🌟 Features

- **Home Dashboard**: View active missions, daily step count, and recent achievements
- **Profile System**: Comprehensive user profiles with achievements and activity history
- **Challenges**: Daily, weekly, and monthly missions to complete
- **Rankings**: Leaderboards showing how you compare to other users
- **Rewards Marketplace**: Redeem gems for real-world rewards
- **Health Integration**: Ready for Apple Health and Google Fit integration
- **GameLayer API**: Complete integration with GameLayer platform

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Styled Components** for modern CSS-in-JS styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **Axios** for API calls
- **Lucide React** for beautiful icons

## 📱 Mobile-First Design

The app is optimized for mobile devices with:
- Responsive design that works on all screen sizes
- Touch-friendly interactions
- Bottom navigation for easy thumb access
- Safe area support for modern smartphones
- PWA-ready configuration

## 🛠 Development

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/judgesteven/employee-app.git

# Navigate to project directory
cd employee-app

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_GAMELAYER_API_KEY=your_api_key_here
REACT_APP_GAMELAYER_API_URL=https://api.gamelayer.co
```

## 🚀 Deployment

### Automatic Deployment with Vercel

This project is configured for automatic deployment to Vercel:

1. **Connect to Vercel**: Import your GitHub repository to Vercel
2. **Environment Variables**: Add your GameLayer API key as `GAMELAYER_API_KEY`
3. **Auto Deploy**: Every push to `main` branch triggers automatic deployment

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to your hosting platform
```

## 🎮 GameLayer Integration

The app integrates with [GameLayer](https://www.gamelayer.co) for:
- User management and authentication
- Mission/challenge creation and tracking
- Leaderboard management
- Achievement system
- Reward catalog management

## 📊 Health Data Integration

Currently includes mock health data services with structure for:
- **Apple HealthKit** integration (iOS)
- **Google Fit** integration (Android)
- Real-time step counting
- Activity data synchronization

## 🎨 UI/UX Features

- **Modern Design Language**: Clean, playful interface
- **Smooth Animations**: Framer Motion powered transitions
- **Glass-morphism Effects**: Modern visual styling
- **Consistent Theming**: Centralized design system
- **Accessibility**: Focus states and semantic HTML

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation/      # Bottom navigation
│   └── Profile/         # Profile-related components
├── pages/               # Main application pages
│   ├── Home.tsx         # Landing page with active missions
│   ├── ProfileDetails.tsx # Complete user profile
│   ├── Challenges.tsx   # Available missions
│   ├── Competition.tsx  # Rankings and leaderboards
│   └── Rewards.tsx      # Rewards marketplace
├── services/            # API and external integrations
│   ├── gameLayerApi.ts  # GameLayer API client
│   └── healthData.ts    # Health data service
├── styles/              # Styling and theming
│   ├── theme.ts         # Design system
│   └── GlobalStyles.ts  # Global styles and components
└── types/               # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Screenshots

*Add screenshots of the app here*

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for employee wellness and engagement