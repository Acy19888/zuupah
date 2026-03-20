# Zuupah - Interactive Learning Pen App

![Zuupah](https://img.shields.io/badge/Zuupah-Play.%20Learn.%20Explore-38b6c9?style=flat-square)
![React Native](https://img.shields.io/badge/React%20Native-0.73-61dafb?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=flat-square)
![Firebase](https://img.shields.io/badge/Firebase-18.6-FFA500?style=flat-square)

A production-ready React Native mobile application for managing and transferring interactive learning books to Zuupah smart pens. Built with TypeScript, Firebase, and Bluetooth Low Energy (BLE) connectivity.

## Features

### MVP Features
- **Book Store** - Browse and download educational books with search and filtering
- **User Library** - Manage downloaded books and track learning progress
- **Bluetooth Transfer** - Seamlessly transfer books to Zuupah pen via BLE
- **User Authentication** - Secure login, registration, and password recovery
- **Firmware Updates** - Check and install pen firmware updates
- **Responsive Design** - Child-friendly, accessible UI with Zuupah brand colors

### Technical Highlights
- Complete TypeScript support with strict types
- Zustand state management for clean, reactive state
- Firebase Auth, Firestore, and Storage integration
- React Native BLE PLX for Bluetooth connectivity
- Comprehensive error handling and user feedback
- Production-ready logging and debugging

## Project Structure

```
zuupah-app/
├── src/
│   ├── assets/                 # Images, icons, fonts
│   ├── components/
│   │   ├── common/            # Reusable UI components (Button, Card, etc)
│   │   ├── BookCard.tsx       # Book display component
│   │   ├── PenConnectionBanner.tsx
│   │   └── CategoryChip.tsx
│   ├── constants/
│   │   ├── colors.ts          # Brand color definitions
│   │   ├── typography.ts      # Typography system
│   │   └── config.ts          # App configuration
│   ├── hooks/
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useBooks.ts        # Books management hook
│   │   └── useBluetooth.ts    # Bluetooth hook
│   ├── navigation/
│   │   ├── AppNavigator.tsx   # Root navigation
│   │   ├── AuthNavigator.tsx  # Auth stack
│   │   └── MainTabNavigator.tsx # Main app navigation
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── auth/              # Login, Register, ForgotPassword
│   │   ├── store/             # Book store screens
│   │   ├── library/           # User library screen
│   │   ├── pen/               # Pen connection & firmware
│   │   └── profile/           # User profile & settings
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── config.ts      # Firebase setup
│   │   │   ├── auth.ts        # Authentication methods
│   │   │   ├── books.ts       # Firestore queries
│   │   │   └── storage.ts     # File storage operations
│   │   └── bluetooth/
│   │       ├── BleManager.ts  # BLE device management
│   │       └── PenProtocol.ts # Pen command protocol
│   ├── store/
│   │   ├── authStore.ts       # Auth state (Zustand)
│   │   ├── bookStore.ts       # Books state (Zustand)
│   │   └── penStore.ts        # Pen/BLE state (Zustand)
│   ├── types/
│   │   ├── book.ts            # Book type definitions
│   │   ├── pen.ts             # Pen/BLE types
│   │   └── user.ts            # User types
│   └── App.tsx                # Root component
├── index.js                    # Entry point
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- React Native development environment (iOS/Android)
- Firebase project with Auth, Firestore, and Storage enabled
- Xcode (for iOS) or Android Studio (for Android)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Acy19888/zuupah.git
cd zuupah-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration values:
```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

4. **iOS Setup**
```bash
cd ios
pod install
cd ..
npm run ios
```

5. **Android Setup**
```bash
npm run android
```

## Development

### Available Scripts

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type checking
npm run type-check

# Linting
npm run lint

# Tests
npm test

# Watch tests
npm run test:watch

# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

### Code Quality

The project uses TypeScript, ESLint, and Jest for code quality:
- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Enforces code style and best practices
- **Jest**: Unit testing framework

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description"

# Push and create PR
git push origin feature/feature-name
```

## Architecture

### State Management (Zustand)
The app uses Zustand for lightweight, efficient state management:

- **authStore**: User authentication and profile
- **bookStore**: Available books and user library
- **penStore**: Bluetooth pen connection and transfers

### Firebase Integration
- **Auth**: Email/password authentication, password reset
- **Firestore**: Book catalog, user data, firmware versions
- **Storage**: Book files, cover images, firmware binaries

### Bluetooth (BLE)
- **BleManager**: Device scanning and connection management
- **PenProtocol**: Command serialization and response handling
- **UUIDs**:
  - Service: `12345678-1234-1234-1234-123456789ABC`
  - Write: `12345678-1234-1234-1234-123456789ABD`
  - Notify: `12345678-1234-1234-1234-123456789ABE`

## API Reference

### Hooks

#### `useAuth()`
```typescript
const {
  user,
  isAuthenticated,
  isLoading,
  error,
  handleSignIn,
  handleSignUp,
  handleSignOut,
  handleForgotPassword
} = useAuth();
```

#### `useBooks()`
```typescript
const {
  books,
  libraryBooks,
  isLoading,
  error,
  handleSearch,
  handleAddToLibrary,
  handleStartDownload,
  handleCompleteDownload
} = useBooks();
```

#### `useBluetooth()`
```typescript
const {
  connectedPen,
  availableDevices,
  connectionStatus,
  isScanning,
  handleStartScan,
  handleConnectToPen,
  handleStartTransfer,
  handleCompleteTransfer
} = useBluetooth();
```

## Firestore Schema

```
/books/{bookId}
  - id: string
  - title: string
  - description: string
  - coverUrl: string
  - audioFileUrl: string
  - price: number
  - isFree: boolean
  - category: string
  - ageMin: number
  - ageMax: number
  - language: string
  - fileSize: number
  - createdAt: string

/users/{userId}
  - uid: string
  - email: string
  - displayName: string
  - purchasedBooks: string[]
  - downloadedBooks: string[]
  - pairedPens: string[]
  - createdAt: string

/firmwareVersions/{versionId}
  - version: string
  - releaseNotes: string
  - downloadUrl: string
  - fileSize: number
  - releaseDate: string
  - isLatest: boolean
```

## Branding

### Colors
- **Beach Blue** (#38b6c9) - Primary color
- **Zesty Orange** (#ff5a1f) - Call-to-action
- **Morning Yellow** (#ffc400) - Accents
- **Soft Pillow Blue** (#eef6f7) - Light backgrounds

### Typography
- Font sizes from 12px to 36px
- Weights: 300-800
- Mobile-optimized line heights

### Design System
- Rounded corners: 8-24px border radius
- Child-friendly interface with large touch targets
- Accessible colors and sufficient contrast

## Performance

- Lazy loading of screens and components
- Optimized Firebase queries with proper indexing
- BLE connection pooling and reuse
- Efficient state updates with Zustand
- Image optimization and caching

## Security

- Firebase Auth for secure user management
- BLE encryption for device communication
- Environment variables for sensitive config
- No hardcoded API keys or credentials
- Input validation on all forms

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- useAuth.test.ts

# Generate coverage report
npm test -- --coverage
```

## Troubleshooting

### Bluetooth Connection Issues
- Ensure pen firmware is up to date
- Check Bluetooth permissions in device settings
- Restart pen and mobile device
- Check BLE signal strength (RSSI)

### Firebase Auth Errors
- Verify Firebase project configuration
- Check network connectivity
- Ensure email verification is enabled
- Check user permissions in Firestore

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear native build cache: `npm run clean`
- Update CocoaPods: `pod repo update`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Write/update tests
5. Submit pull request

## License

Proprietary - Zuupah Inc.

## Support

For issues, questions, or feedback:
- Email: support@zuupah.com
- GitHub Issues: https://github.com/Acy19888/zuupah/issues
- Documentation: https://docs.zuupah.com

## Roadmap

- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Parental controls dashboard
- [ ] Learning analytics
- [ ] Social features (share books, achievements)
- [ ] Web dashboard for parents
- [ ] Advanced search with Algolia
- [ ] Real-time collaboration

## Changelog

### v0.1.0 (Initial Release)
- Book store with search and filtering
- User authentication with Firebase
- Bluetooth pen connection and transfers
- Book library management
- Firmware update check
- User profile and settings
